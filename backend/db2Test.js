require("dotenv").config();

const connectDB2 = require("./src/config/db2");

async function test() {
  let connection;

  try {
    connection = await connectDB2();

    const result = await connection.query(`
WITH branches AS (
        SELECT *
        FROM (
          SELECT DISTINCT
            RIGHT(BRANCHSORTCODE, 4) AS branchcode4,
            RIGHT(BRANCHSORTCODE, 3) AS branchcode,
            BANKREGIONCODE,
            b2.branchname,

            CASE
              WHEN SUBSTR(BRANCHSORTCODE, 5, 1) IN ('1', '2')
              THEN 'OLD'
              ELSE 'NEW'
            END AS branchType,

            ROW_NUMBER() OVER (
              PARTITION BY
                RIGHT(BRANCHSORTCODE, 3),
                CASE
                  WHEN SUBSTR(BRANCHSORTCODE, 5, 1) IN ('1', '2')
                  THEN 'OLD'
                  ELSE 'NEW'
                END
              ORDER BY BRANCHSORTCODE
            ) AS branch_order

          FROM WASADMIN.BRANCH b2

          LEFT JOIN AIB.AIB_BANKREGION br
            ON RIGHT(br.BRANCHCODE, 4)
               = RIGHT(b2.BRANCHSORTCODE, 4)

          WHERE LOWER(b2.BRANCHNAME) NOT LIKE '%reserve%'
            AND LOWER(b2.BRANCHNAME) NOT LIKE '%reser%'
            AND LOWER(b2.BRANCHNAME) NOT LIKE '%reseve%'
            AND RIGHT(BRANCHSORTCODE, 4)
                NOT IN ('1000', '2000', '1002', '2002', '9999')
        ) b

        WHERE b.branch_order = 1
      ),

      maxExchangeRate AS (
        SELECT
          FROMCURRENCYCODE,
          MAX(DATELASTMODIFIED) AS maxDate

        FROM WASADMIN.EXCHANGERATESHISTORY

        WHERE DATE(DATELASTMODIFIED) <= (
          SELECT DATE(BFCURRENTFREEZETIME)
          FROM BANKFUSION.BFTB_PERSISTENTTAG
        )

        AND EXCHANGERATETYPE = 'MID'

        GROUP BY FROMCURRENCYCODE
      ),

      withExchangeRate AS (
        SELECT DISTINCT
          er.FROMCURRENCYCODE,
          er.RATE

        FROM WASADMIN.EXCHANGERATESHISTORY er

        INNER JOIN maxExchangeRate er2
          ON er2.FROMCURRENCYCODE = er.FROMCURRENCYCODE
         AND er.DATELASTMODIFIED = er2.maxDate

        WHERE er.TOCURRENCYCODE = 'ETB'
          AND er.EXCHANGERATETYPE = 'MID'

        UNION

        SELECT
          'ETB',
          1.0

        FROM BANKFUSION.BFTB_PERSISTENTTAG
      ),

      ShadowBalanceConventional AS (
        SELECT
          SUM(sb.SHADOWCLEAREDBALANCE * e.RATE) AS DepositBalance,
          br.branchcode,
          br.branchType

        FROM WASADMIN.ACCOUNT a

        INNER JOIN WASADMIN.UBTB_SHADOWACCOUNTFREEZE sb
          ON sb.ACCOUNTID = a.ACCOUNTID

        INNER JOIN branches br
          ON br.branchcode = RIGHT(a.BRANCHSORTCODE, 3)
         AND br.branchtype =
             CASE
               WHEN SUBSTR(a.BRANCHSORTCODE, 5, 1) IN ('1', '2')
               THEN 'OLD'
               ELSE 'NEW'
             END

        INNER JOIN withExchangeRate e
          ON a.ISOCURRENCYCODE = e.FROMCURRENCYCODE

        INNER JOIN WASADMIN.PRODUCTINHERITANCE p
          ON a.PRODUCTCONTEXTCODE = p.PRODUCTCONTEXTCODE

        WHERE (
          (
            p.PRODUCT_ACC_PRODUCTID IN (
              'Savings',
              'SpecialSAV',
              'notice',
              'CurrentAccount',
              'fixdep'
            )

            AND p.UBSUBPRODUCTID NOT IN ('01432', '01438')

            AND a.ACCOUNTID NOT IN (
              '01304005574300',
              '013041194227701'
            )
          )

          OR (
            (
              a.ACCOUNTID = '01304005574300'
              OR p.PRODUCT_ACC_PRODUCTID = 'OverDrafts'
            )

            AND sb.SHADOWCLEAREDBALANCE > 0
          )
        )

        AND (
          a.closed = 'N'
          OR (
            a.closed = 'Y'
            AND sb.SHADOWCLEAREDBALANCE <> 0
          )
        )

        GROUP BY
          br.branchcode,
          br.branchType
      ),

      ShadowBalanceIFB AS (
        SELECT
          SUM(sb.SHADOWCLEAREDBALANCE * e.RATE) AS DepositBalance,
          br.branchcode,
          br.branchType

        FROM WASADMIN.ACCOUNT a

        INNER JOIN WASADMIN.UBTB_SHADOWACCOUNTFREEZE sb
          ON sb.ACCOUNTID = a.ACCOUNTID

        INNER JOIN branches br
          ON br.branchcode = RIGHT(a.BRANCHSORTCODE, 3)
         AND br.branchtype =
             CASE
               WHEN SUBSTR(a.BRANCHSORTCODE, 5, 1) IN ('1', '2')
               THEN 'OLD'
               ELSE 'NEW'
             END

        INNER JOIN withExchangeRate e
          ON a.ISOCURRENCYCODE = e.FROMCURRENCYCODE

        INNER JOIN WASADMIN.PRODUCTINHERITANCE p
          ON a.PRODUCTCONTEXTCODE = p.PRODUCTCONTEXTCODE

        WHERE (
          p.PRODUCT_ACC_PRODUCTID IN (
            'IFBSpecialSAV',
            'IFBSavings',
            'IFBCurrent',
            'MudarabaInvest'
          )

          OR p.UBSUBPRODUCTID IN ('01432', '01438')

          OR a.ACCOUNTID = '013041194227701'
        )

        AND (
          a.closed = 'N'
          OR (
            a.closed = 'Y'
            AND sb.SHADOWCLEAREDBALANCE <> 0
          )
        )

        GROUP BY
          br.branchcode,
          br.branchType
      ),

      Total_balance AS (
        SELECT
          db.branchcode,
          db.DepositBalance,
          db.branchType

        FROM ShadowBalanceConventional db

        UNION ALL

        SELECT
          db.branchcode,
          db.DepositBalance,
          db.branchType

        FROM ShadowBalanceIFB db
      )

      SELECT
        SUM(DepositBalance) AS TOTAL_BALANCE_CORE

      FROM Total_balance
    `);

    console.log("Query result:");
    console.log(result);
  } catch (error) {
    console.error("DB2 Test Failed:");
    console.error(error);
  } finally {
    if (connection) {
      await connection.close();
      console.log("DB2 connection closed");
    }
  }
}

test();

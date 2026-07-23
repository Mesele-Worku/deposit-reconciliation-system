const oracledb = require("oracledb");
const connectOracle = require("../config/oracle");

// Get all users

const getUsers = async (search = "") => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
SELECT

USER_ID,
USERNAME,
FULL_NAME,
ROLE,
STATUS,
CREATED_DATE

FROM TESTUSER.EDRMS_USERS

WHERE LOWER(USERNAME) LIKE LOWER(:search)
OR LOWER(FULL_NAME) LIKE LOWER(:search)

ORDER BY USER_ID DESC

`,
    {
      search: `%${search}%`,
    },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows;
};

// Get one user

const getUserById = async (id) => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
SELECT *

FROM TESTUSER.EDRMS_USERS

WHERE USER_ID=:id

`,
    {
      id,
    },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows[0];
};

const findByUsername = async (username) => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
SELECT
USER_ID,
USERNAME,
PASSWORD_HASH,
FULL_NAME,
ROLE,
STATUS,
CREATED_DATE

FROM TESTUSER.EDRMS_USERS

WHERE USERNAME=:username
`,

    {
      username,
    },

    {
      outFormat: require("oracledb").OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows[0];
};

// Create user

const createUser = async (user) => {
  const connection = await connectOracle();

  await connection.execute(
    `
INSERT INTO TESTUSER.EDRMS_USERS
(
USERNAME,
PASSWORD_HASH,
FULL_NAME,
ROLE,
STATUS
)

VALUES
(
:username,
:passwordHash,
:fullName,
:role,
'ACTIVE'
)

`,
    user,
    {
      autoCommit: true,
    },
  );

  await connection.close();
};

// Update user

const updateUser = async (id, data) => {
  const connection = await connectOracle();

  await connection.execute(
    `
UPDATE TESTUSER.EDRMS_USERS

SET

FULL_NAME=:fullName,

ROLE=:role


WHERE USER_ID=:id

`,
    {
      id,
      fullName: data.fullName,
      role: data.role,
    },
    {
      autoCommit: true,
    },
  );

  await connection.close();
};

// Change status

const updateStatus = async (id, status) => {
  const connection = await connectOracle();

  await connection.execute(
    `
UPDATE TESTUSER.EDRMS_USERS

SET STATUS=:status

WHERE USER_ID=:id

`,
    {
      id,
      status,
    },
    {
      autoCommit: true,
    },
  );

  await connection.close();
};

// Reset password

const resetPassword = async (id, passwordHash) => {
  const connection = await connectOracle();

  await connection.execute(
    `
UPDATE TESTUSER.EDRMS_USERS

SET PASSWORD_HASH=:passwordHash

WHERE USER_ID=:id

`,
    {
      id,
      passwordHash,
    },
    {
      autoCommit: true,
    },
  );

  await connection.close();
};

const getActiveAdmins = async () => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
SELECT
USER_ID

FROM TESTUSER.EDRMS_USERS

WHERE ROLE='ADMIN'

AND STATUS='ACTIVE'

`,
  );

  await connection.close();

  return result.rows;
};

module.exports = {
  getUsers,

  getUserById,

  findByUsername,

  createUser,

  updateUser,

  updateStatus,

  resetPassword,

  getActiveAdmins,
};

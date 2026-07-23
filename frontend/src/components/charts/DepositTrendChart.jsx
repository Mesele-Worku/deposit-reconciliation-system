import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DepositTrendChart = () => {
  const data = [
    {
      date: 'Jul 18',
      deposit: 120000000,
    },

    {
      date: 'Jul 19',
      deposit: 135000000,
    },

    {
      date: 'Jul 20',
      deposit: 145000000,
    },

    {
      date: 'Jul 21',
      deposit: 150000000,
    },
  ];

  return (
    <div className="h-[280px] w-full sm:h-[350px] lg:h-[400px]">
      <h3 className="mb-3 text-sm font-bold text-[#232A78] sm:text-base">Deposit Trend</h3>

      <ResponsiveContainer
        width="100%"

        height="100%"
      >
        <AreaChart
          data={data}

          margin={{
            top: 10,

            right: 10,

            left: -20,

            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"

            fontSize={window.innerWidth < 640 ? 10 : 12}
          />

          <YAxis
            tickFormatter={(value) => `${value / 1000000}M`}

            fontSize={window.innerWidth < 640 ? 10 : 12}
          />

          <Tooltip formatter={(value) => value.toLocaleString()} />

          <Area
            type="monotone"

            dataKey="deposit"

            stroke="#232A78"

            fill="#232A78"

            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepositTrendChart;

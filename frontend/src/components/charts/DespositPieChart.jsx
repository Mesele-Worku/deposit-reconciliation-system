// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const COLORS = ['#232A78', '#2F3A9A', '#4655C8', '#6475E6', '#FF9710', '#FFC266'];

// const DepositPieChart = ({ segments = {} }) => {
//   const data = Object.entries(segments).map(([name, value]) => ({
//     name,
//     value,
//   }));

//   return (
//     <div className="rounded-2xl bg-white p-6 shadow">
//       <h2 className="mb-6 text-xl font-bold text-[#232A78]">Deposit Distribution</h2>

//       <ResponsiveContainer width="100%" height={350}>
//         <PieChart>
//           <Pie data={data} dataKey="value" outerRadius={120} label>
//             {data.map((entry, index) => (
//               <Cell key={index} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>

//           <Tooltip />

//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default DepositPieChart;
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DepositPieChart = ({ segments }) => {
  const data = Object.entries(segments || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#232A78', '#FF9710', '#16A34A', '#6366F1', '#DC2626', '#0891B2'];

  return (
    <div className="h-[280px] w-full sm:h-[350px] lg:h-[400px]">
      <h3 className="mb-3 text-sm font-bold text-[#232A78] sm:text-base">Deposit Distribution</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}

            cx="50%"

            cy="50%"

            innerRadius="45%"

            outerRadius="70%"

            paddingAngle={3}

            dataKey="value"

            label={({ name, percent }) =>
              window.innerWidth > 640
                ? `${name} ${(percent * 100).toFixed(0)}%`
                : `${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}

                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value) => value.toLocaleString()} />

          <Legend
            verticalAlign="bottom"

            height={35}

            wrapperStyle={{
              fontSize: window.innerWidth < 640 ? '11px' : '14px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepositPieChart;

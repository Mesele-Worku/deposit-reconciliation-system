import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}

      className="w-full rounded-xl border-t-4 bg-white p-4 shadow sm:p-6"

      style={{
        borderColor: color,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-gray-500 sm:text-sm">{title}</p>

          <h2 className="mt-2 text-xl font-bold break-words sm:text-3xl">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
        </div>

        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white sm:h-16 sm:w-16"

          style={{
            background: color,
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryCard;

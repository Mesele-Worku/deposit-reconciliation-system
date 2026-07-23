const SegmentCard = ({ name, value }) => {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow sm:p-5">
      <p className="truncate text-xs text-gray-500 sm:text-sm">{name}</p>

      <p className="mt-2 text-sm font-bold break-words text-[#232A78] sm:text-xl">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default SegmentCard;

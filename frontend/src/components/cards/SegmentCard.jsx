const SegmentCard = ({ name, value }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-center text-sm text-gray-500 uppercase">{name}</p>

      <p className="mt-2 text-center text-sm font-bold text-[#232A78] md:text-lg">
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default SegmentCard;

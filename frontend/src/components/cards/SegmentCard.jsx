const SegmentCard = ({
  name,
  value
}) => {


  return (

    <div
      className="
            rounded-xl
            bg-white
            p-4
            shadow
            "
    >


      <p
        className="
                text-sm
                text-gray-500
                "
      >

        {name}

      </p>




      <p
        className="
                mt-2
                text-lg
                font-bold
                text-[#232A78]
                "
      >

        {
          Number(value || 0)
            .toLocaleString()
        }

      </p>



    </div>

  );

};


export default SegmentCard;
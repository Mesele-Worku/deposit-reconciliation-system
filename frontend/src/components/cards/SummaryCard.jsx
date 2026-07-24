const SummaryCard = ({
  title,
  value,
  icon,
  color
}) => {



  return (


    <div
      className="
            rounded-xl
            bg-white
            p-5
            shadow
            "
    >



      <div
        className="
                flex
                items-center
                justify-between
                "
      >



        <div>


          <p
            className="
                        text-sm
                        text-gray-500
                        "
          >

            {title}

          </p>





          <p
            className="
                        mt-2
                        text-xl
                        font-bold
                        text-gray-800
                        sm:text-2xl
                        "
          >

            {
              Number(value || 0)
                .toLocaleString()
            }


          </p>



        </div>







        <div
          className="
                    rounded-full
                    p-4
                    text-white
                    "
          style={{
            backgroundColor: color
          }}
        >

          {
            icon
          }


        </div>



      </div>




    </div>


  );


};



export default SummaryCard;
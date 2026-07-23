// const StatusBadge = ({status})=>{

// const colors={

//     PASS:
//     "bg-green-100 text-green-700",

//     FAIL:
//     "bg-red-100 text-red-700",

//     WARNING:
//     "bg-yellow-100 text-yellow-700"

// };

// return (

// <span
// className={`
// px-3 py-1 rounded-full text-sm font-semibold
// ${colors[status]}
// `}
// >

// {status}

// </span>

// );

// };

// export default StatusBadge;

const StatusBadge = ({ status }) => {
  const styles = {
    PASS: 'bg-green-500 text-white',

    FAIL: 'bg-red-500 text-white',

    WARNING: 'bg-yellow-400 text-black',
  };

  return (
    <span className={`rounded-full px-4 py-1 text-sm font-bold ${styles[status]} `}>{status}</span>
  );
};

export default StatusBadge;

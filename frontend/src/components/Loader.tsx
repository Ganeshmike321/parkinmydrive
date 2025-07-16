import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader: React.FC = () => {
  return (
    <ThreeDots
      visible
      height={40}
      width={40}
      color="#ff7902"
      radius={9}
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Loader;



// import { ThreeDots } from "react-loader-spinner";

// const Loader = () => {
//   return (
//     <ThreeDots
//       visible={true}
//       height="40"
//       width="40"
//       color="#ff7902"
//       radius="9"
//       ariaLabel="three-dots-loading"
//       wrapperStyle={{}}
//       wrapperClass=""
//     />
//   );
// };

// export default Loader;

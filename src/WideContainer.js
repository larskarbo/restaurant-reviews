import React, {  } from 'react';


function WideContainer({ children }) {

  return (
    <div className="flex flex-col flex-grow p-12 rounded w-full bg-white  border border-gray-300 shadow-lg ">

      {children}

    </div>
  );
}

export default WideContainer;

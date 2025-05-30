import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="justify-center items-center h-16 flex">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Loading;

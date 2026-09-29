import React from "react";

function ActionButton({ id, setAction, icon, bgColor, title }) {
  return (
    <button
      onClick={() => setAction(id)}
      title={title}
      className={`text-white text-lg w-fit ${bgColor}  rounded p-[5px] flex items-center`}
    >
      {icon}
    </button>
  );
}

export default ActionButton;

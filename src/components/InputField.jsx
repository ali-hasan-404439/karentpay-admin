import React from "react";
import { IoMdClose } from "react-icons/io";
import { LuCheck } from "react-icons/lu";

function InputField({
  label,
  value,
  onChange,
  id,
  error,
  type,
  image,
  close,
  refState,
  required,
  readOnly
}) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {type === "file" ? (
        <>
          <input
            ref={refState}
            id={id}
            name="icon"
            onChange={onChange}
            className="block w-full text-gray-900 border border-gray-300 rounded bg-gray-50 focus:outline-none  dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
          />
          {image && (
            <div className="relative w-fit mt-2">
              <img src={image} alt="payment" className="max-w-[150px] h-auto" />

              <div
                onClick={() => {
                  close(null);
                  // Reset the file input field
                  const fileInput = document.getElementById("icon");
                  if (fileInput) {
                    fileInput.value = "";
                  }
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-red-600 flex items-center justify-center text-3xl cursor-pointer"
              >
                <IoMdClose />
              </div>
            </div>
          )}
        </>
      ) : type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          id={id}
          cols="30"
          placeholder={label}
          rows="5"
          className={`border text-gray-900 rounded-[4px] ${value ? "border-green-500 dark:border-green-500" : "border-gray-300"
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          required
        />
      ) : (
        <>
          <input
            onChange={(e) => onChange(e.target.value)}
            value={value || ""}
            type={type ? type : "text"}
            id={id}
            className={`border text-gray-900 rounded-[4px] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${value
              ? "focus:ring-green-500 border-green-500"
              : "border-gray-300"
              }`}
            placeholder={label}
            readOnly={readOnly}
          />
          {value && (
            <span className="absolute top-[45px] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
              <LuCheck />
            </span>
          )}
        </>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default InputField;

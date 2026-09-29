import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "./SaneEditor.css";

import axios from "axios";

function SaneEditor({ editorContent, height, initialContent }) {

  function handleImageUploadBefore(files, uploadHandler) {

    uploadHandler(files);
  }

  const UploadToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      var base_url = import.meta.env.VITE_API_HOST;
      var img_url = import.meta.env.VITE_API_IMAGE;
      const response = await axios.post(base_url + "/upload_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.status === 200) {
        const data = response.data.data;
        return img_url + "/images/new/" + data;
      } else {
        console.error("Upload failed:", response?.message);
        return null;
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
      return null;
    }
  };

  return (
    <>
      <SunEditor
        placeholder="Please type here..."
        autoFocus={false}
        width="100%"
        height={height ? height : "200"}
        setContents={initialContent}
        onImageUploadBefore={handleImageUploadBefore}
        onChange={editorContent}
        setOptions={{
          buttonList: [
            ["undo", "redo", "save"],
            ["font", "fontSize"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["table", "list", "align", "horizontalRule", "outdent", "indent"],
            ["fontColor", "hiliteColor", "textStyle"],
            ["math", "image", "audio", "video"],
            ["removeFormat", "link", "print", "fullScreen", "codeView"],
          ],
          defaultStyle: "font-size: 16px;",
          katex: katex, // Provide the katex object here
        }}
      />
    </>
  );
}

export default SaneEditor;

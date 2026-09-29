import { useEffect, useState } from "react";

import { LuCheck } from "react-icons/lu";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function FaqEdit({ faqEditModalOpen, setFaqEditModalOpen, setFaqData }) {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faqEditModalOpen) {
      setAnswer(faqEditModalOpen.answer || "");
      setQuestion(faqEditModalOpen.question || "");
    }
  }, [faqEditModalOpen]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!answer) newErrors.answer = "Answer is required.";
    if (!question) newErrors.question = "Question is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleFaqEdit = (id) => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("answer", answer);
    formData.append("question", question);
    formData.append("_method", "PUT");

    const token = Cookies.get("token");

    axios
      .post(`${import.meta.env.VITE_API_HOST}/admin/faqs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setFaqData((prevData) => {
            return prevData.map((item) => {
              if (item.id === faqEditModalOpen.id) {
                return {
                  ...item,
                  answer: answer,
                  question: question,
                };
              }
              return item;
            });
          })
          toast.success("Review updated successfully");
          setFaqEditModalOpen("");
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error("Failed to update review");
        setLoading(false);
      });
  };
  return (
    <>
      {faqEditModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/10"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative p-10 bg-white rounded-[4px] shadow dark:bg-gray-700">
              <div className="relative space-y-5 text-black dark:text-white">
                <InputField
                  label="Question"
                  value={question}
                  onChange={setQuestion}
                  id="Question"
                  required={true}
                  error={errors.question}
                />
                <InputField
                  label="Answer"
                  value={answer}
                  onChange={setAnswer}
                  id="Answer"
                  type="textarea"
                  required={true}
                  error={errors.answer}
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFaqEdit(faqEditModalOpen.id)}
                    type="button"
                    className="button_gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Updated"
                    )}
                  </button>
                  <button
                    onClick={() => setFaqEditModalOpen("")}
                    type="button"
                    className="button_cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FaqEdit;

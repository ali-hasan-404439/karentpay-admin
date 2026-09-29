import { PiClipboardFill } from 'react-icons/pi';
import { toast } from 'react-toastify';

export function TextCopy({ text, fontSize }) {
    return (
        <h2 className=" flex gap-1 whitespace-normal cursor-pointer">
            <span
                onClick={() =>
                    navigator?.clipboard
                        .writeText(text)
                        .then(() => {
                            toast.success("Copied successfully!", {
                                position: "top-center",
                            });
                        })
                        .catch(() => {
                            toast.error(
                                "Failed to copy. Please try again.",
                                {
                                    position: "top-center",
                                }
                            );
                        })
                }
                className="cursor-pointer"
            >
                <PiClipboardFill className="text-xl text-[#08987C] hover:text-[#065A47] transition-colors duration-200" />
            </span>

            <span className={`${fontSize}`}>
                {typeof text === "string" && text.length > 10
                    ? `${text.slice(0, 10)}...`
                    : text}
            </span>
        </h2>
    );
}

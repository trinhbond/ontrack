import { TypeOptions, toast } from "react-toastify";

export const toastMessage = (
  message: string,
  type: TypeOptions,
  toastId: React.RefObject<string | number | null>,
) => {
  if (!toast.isActive(toastId.current || "")) {
    toast(message, {
      type: type,
      position: "bottom-center",
      theme: "colored",
      icon: false,
      hideProgressBar: true,
      toastId: type,
    });
  }
};

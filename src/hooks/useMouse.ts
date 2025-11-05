import { useEffect, useState, RefObject } from "react";

export default function useMouse(ref: RefObject<HTMLElement>) {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = () => setClicked(!clicked);

  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (ref.current && !ref.current.contains(target as Node)) {
        if (clicked) handleClick();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clicked]);

  return { handleClick, clicked };
}

import React from "react";

export default function ScrollButton() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button className="scroll-to-top" onClick={handleScrollToTop}>
      &#8593;
    </button>
  );
}

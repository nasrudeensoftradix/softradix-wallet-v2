import React, { useEffect, useRef } from "react";

import TradingViewWidget, { Themes } from "react-tradingview-widget";

export default function ChartModal({ isShow, selectedChain, closeModal }) {
  const modalRef = useRef();

  useEffect(() => {
    if (modalRef && modalRef.current) {
      modalRef.current.addEventListener("click", () => {
        if (modalRef.current !== null) {
          console.log(modalRef, "modalRef");
          closeModal();
        }
      });
    }
    return () => null;
  }, []);
  return (
    <div className={`widget_divs ${isShow ? "active" : ""}`} ref={modalRef}>
      <TradingViewWidget
        symbol={selectedChain || "NASDAQ:AAPL"}
        theme={Themes.DARK}
        locale="fr"
        width={700}
        height={400}
      />
    </div>
  );
}

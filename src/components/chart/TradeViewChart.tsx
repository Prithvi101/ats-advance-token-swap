"use client";
import React, { useEffect, useRef, memo } from "react";

interface TradeChartProps {
  chartSymbol: string;
}

const TradeViewChart: React.FC<TradeChartProps> = ({ chartSymbol }) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing children to prevent duplicate charts
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
              {
                "symbol": "${chartSymbol}USD",
                "interval": "D",
                "support_host": "https://www.tradingview.com",
                "timezone": "exchange",
                "theme": "dark",
                "style": "1",
                "withdateranges": true,
                "hide_side_toolbar": false,
                "allow_symbol_change": false,
                "save_image": false,
                "studies": [
  				"MASimple@tv-basicstudies"
                ],
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650"
              }`;

    container.current.appendChild(script);

    // Cleanup function to remove the script on unmount
    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [chartSymbol]); // Re-run effect if symbol changes

  return (
    <div className="h-full  flex-1" ref={container}>
      <div
        className="tradingview-widget-container__widget"
        style={{
          flexGrow: 1, // Ensures the widget takes up all available space
          height: "100%",
          width: "100%",
          backgroundColor: "black",
        }}
      ></div>
    </div>
  );
};

export default memo(TradeViewChart);

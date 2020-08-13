import React from "react";

export default function Loader({ size }) {
  let style;
  if (size === "small") {
    style = { height: "20px", width: "20px" };
  }
  return <div className="loader" style={style} />;
}

import React from "react";
import error404 from "../assets/images/error404.jpg";

export const Error404 = () => {
  return (
    <div className="flex justify-center items-center">
      <img src={error404} alt=""  className="h-screen"/>
    </div>
  );
};

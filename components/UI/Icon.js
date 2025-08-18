import { AntDesign } from "@expo/vector-icons";
import React from "react";

const Icon = ({ name, size = 20, color, style, ...props }) => {
  return (
    <AntDesign name={name} size={size} color={color} style={style} {...props} />
  );
};

export default Icon;

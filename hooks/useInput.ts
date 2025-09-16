import React, { useState, useEffect } from "react";

export const useInput = (value: string | undefined = "23") => {
  const [input, setInput] = useState<string>(value);

  useEffect(() => {
    setInput(value);
    return () => {
      setInput("23");
    };
  }, [value]);

  return {
    input,
    setInput,
  };
};

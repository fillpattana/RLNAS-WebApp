import { createContext, useContext, useState } from "react";

// Create context
const TimestampContext = createContext();

// Custom hook to use the context
export const useTimestamp = () => useContext(TimestampContext);

// Provider component
export const TimestampProvider = ({ children }) => {
  const [timestamp, setTimestamp] = useState(null);

  return (
    <TimestampContext.Provider value={{ timestamp, setTimestamp }}>
      {children}
    </TimestampContext.Provider>
  );
};

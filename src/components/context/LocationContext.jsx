import { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("foodverse_city");
    if (saved) {
      setCity(saved);
    }
  }, []);

  const changeCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem("foodverse_city", newCity);
  };

  return (
    <LocationContext.Provider value={{ city, changeCity }}>
      {children}
    </LocationContext.Provider>
  );
};

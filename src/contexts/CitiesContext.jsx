import { createContext, useState, useEffect, useContext } from "react";
const CitiesContext = createContext();
const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(() => {
    fetch("http://localhost:9000/cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        setIsLoading(false);
      });
  }, []);

  const getCity = async (cityId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:9000/cities/${cityId}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("Ther was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
};

const useCitiesProvider = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("Please use Context Provider inside Cities Provider");
  }
  return context;
};
export { CitiesProvider, useCitiesProvider };

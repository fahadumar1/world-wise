import { createContext, useState, useEffect, useContext } from "react";
const CitiesContext = createContext();
const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:9000/cities");
        const data = await res.json();
        console.log(data);
        setCities(data);
      } catch {
        alert("There was an error loading data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
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
  const createCity = async (newCity) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:9000/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCities((prev) => [...prev, newCity]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, createCity }}
    >
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

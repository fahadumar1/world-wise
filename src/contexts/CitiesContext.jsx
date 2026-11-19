import { createContext, useEffect, useContext, useReducer } from "react";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: true,
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:9000/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities..",
        });
      }
    };
    fetchCities();
  }, []);

  const getCity = async (cityId) => {
    if (Number(cityId) === currentCity.id) {
      return;
    }
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:9000/cities/${cityId}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading city...",
      });
    }
  };
  const createCity = async (newCity) => {
    try {
      dispatch({ type: "loading" });
      await fetch(`http://localhost:9000/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating a new city...",
      });
    }
  };
  const deleteCity = async (e, cityId) => {
    e.preventDefault();
    try {
      dispatch({ type: "loading" });
      await fetch(`http://localhost:9000/cities/${cityId}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: cityId });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting a city...",
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
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

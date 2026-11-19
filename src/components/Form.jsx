import { useEffect, useReducer } from "react";
import { useCitiesProvider } from "../contexts/CitiesContext";
import Button from "./Button";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
// function convertToEmoji(countryNameCode) {
//   const codePoints = countryNameCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

const BASE_URL = "https://api-bdc.net/data/reverse-geocode?";
const API_KEY = import.meta.env.VITE_REVERSE_GEOCODING_API_KEY;
const initialState = {
  cityName: "",
  countryName: "",
  notes: "",
  date: new Date(),
  isLoadingGeoLocation: false,
  errorGeoLocation: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setCityName":
      return {
        ...state,
        cityName: action.payload.cityName,
        countryName: action.payload.countryName,
      };
    case "setNote":
      return { ...state, notes: action.payload };
    case "setDate":
      return { ...state, date: action.payload };
    case "newCitySubmission":
      return {};
    case "setError":
      return { ...state, errorGeoLocation: action.payload };
    case "setLoading":
      return {
        ...state,
        isLoadingGeoLocation: action.payload,
      };
    default:
      return state;
  }
};
function Form() {
  const [
    {
      cityName,
      countryName,
      notes,
      date,
      isLoadingGeoLocation,
      errorGeoLocation,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [mapLat, mapLng] = useUrlPosition();
  const { createCity, isLoading } = useCitiesProvider();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        dispatch({ type: "setLoading", payload: true });
        dispatch({ type: "setError", payload: "" });
        const res = await fetch(
          `${BASE_URL}latitude=${mapLat}&longitude=${mapLng}&key=${API_KEY}`,
        );
        if (!res.ok) {
          throw new Error("Failed To Fetch");
        }
        const data = await res.json();
        dispatch({
          type: "setCityName",
          payload: {
            cityName: data.city || data.locality || "",
            countryName: data.countryName,
          },
        });
      } catch (err) {
        dispatch({ type: "setError", payload: err.message });
      } finally {
        dispatch({ type: "setLoading", payload: false });
      }
    };
    if (mapLat && mapLng) {
      fetchCityData();
    }
  }, [mapLat, mapLng]);
  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!cityName || !date) {
      dispatch({
        type: "setError",
        payload: "Please Enter City Name and Date",
      });
    }
    const newCity = {
      cityName,
      countryName,
      date,
      notes,
      position: { lat: mapLat, lng: mapLng },
    };
    await createCity(newCity);
    navigate("/app");
  };
  return isLoadingGeoLocation ? (
    <Spinner />
  ) : errorGeoLocation ? (
    <Message message={errorGeoLocation} />
  ) : mapLat && mapLng ? (
    <form
      className={`${styles.form} ${isLoading ? `${styles.loading}` : ""}`}
      onSubmit={(e) => handleSubmission(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "setCityName", payload: e.target.value })
          }
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => dispatch({ type: "setDate", payload: date })}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: "setNote", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button btnType="primary">Add</Button>
        <BackButton btnType="back"></BackButton>
      </div>
    </form>
  ) : (
    <Message message="Select the City By Click On The Map" />
  );
}

export default Form;

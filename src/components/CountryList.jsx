import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";
import { useCitiesProvider } from "../contexts/CitiesContext";

const CountryList = () => {
  const { cities, isLoading } = useCitiesProvider();
  const countries = cities.reduce((acc, cur) => {
    if (acc.some((country) => country.countryName === cur.countryName)) {
      return acc;
    } else {
      return [
        ...acc,
        { countryName: cur.countryName, emoji: cur.emoji, id: cur.id },
      ];
    }
  }, []);
  console.log(countries);
  return isLoading ? (
    <Spinner />
  ) : cities.length ? (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  ) : (
    <Message message="Add your first city by clicking on a city on the map" />
  );
};

export default CountryList;

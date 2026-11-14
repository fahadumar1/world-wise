import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./CityList.module.css";
import { useCitiesProvider } from "../contexts/CitiesContext";
const CityList = () => {
  const { cities, isLoading } = useCitiesProvider();

  return isLoading ? (
    <Spinner />
  ) : cities.length ? (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  ) : (
    <Message message="Add your first city by clicking on a city on the map" />
  );
};

export default CityList;

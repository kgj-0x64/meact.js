import { Place } from "./Place.js";
import { places } from "../data.js";

export function List() {
  const listItems = places.map((place) => (
    <li key={place.id}>
      <Place place={place} />
    </li>
  ));

  return <ul>{...listItems}</ul>;
}

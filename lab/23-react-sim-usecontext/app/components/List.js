import { useState } from "@meact";
import { Place } from "./Place.js";
import { places } from "../data.js";
import { HideImageContext } from "../contexts.js";

export function List() {
  const [showImage, setShowImage] = useState(true);

  const listItems = places.map((place) => (
    <li key={place.id}>
      <Place place={place} />
    </li>
  ));

  return (
    <HideImageContext.Provider value={showImage}>
      <label>
        <input
          type="checkbox"
          prop:checked={showImage}
          prop:onchange={(e) => {
            setShowImage(e.target.checked);
          }}
        />
        Show images
      </label>
      <hr />
      <ul>{...listItems}</ul>
    </HideImageContext.Provider>
  );
}

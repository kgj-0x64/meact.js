import { useContext } from "@meact";
import { HideImageContext } from "../contexts.js";
import { getImageUrl } from "../utils.js";

export function PlaceImage({ place, imageSize }) {
  const hideImage = useContext(HideImageContext);

  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
      style={hideImage ? { display: "none" } : {}}
    />
  );
}

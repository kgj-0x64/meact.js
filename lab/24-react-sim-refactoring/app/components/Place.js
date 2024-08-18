import { useContext } from "@meact";
import { ImageSizeContext } from "../contexts.js";
import { PlaceImage } from "./PlaceImage.js";

export function Place({ place }) {
  const imageSize = useContext(ImageSizeContext);

  return (
    <>
      <PlaceImage place={place} imageSize={imageSize} />
      <p>
        <b>{place.name}</b>
        {": " + place.description}
        <br />
        <span>Image Size: {imageSize}</span>
      </p>
    </>
  );
}

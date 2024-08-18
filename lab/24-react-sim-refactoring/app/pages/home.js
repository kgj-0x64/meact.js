import { useState } from "@meact";
import { ImageSizeContext } from "../contexts.js";
import { List } from "../components/index.js";

export default function Page() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;

  return (
    <ImageSizeContext.Provider value={imageSize}>
      <label>
        <input
          type="checkbox"
          prop:checked={isLarge}
          prop:onchange={(e) => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  );
}

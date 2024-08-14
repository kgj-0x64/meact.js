import { createElement } from "./createElement.js";
import { useState, useRef, useEffect, useMemo } from "./hooks/index.js";
import { memo } from "./memo.js";

const Meact = {
  createElement,
};

export { useState, useRef, useEffect, useMemo, memo };

export default Meact;

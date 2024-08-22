import { createElement } from "./createElement.js";
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "./hooks/index.js";
import { memo } from "./memo.js";
import meactRendererBridge from "./bridge.js";

const Meact = {
  createElement,
};

export {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  useContext,
  createContext,
};

export { meactRendererBridge };

export default Meact;

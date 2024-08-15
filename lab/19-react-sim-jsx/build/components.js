"use strict";

function _slicedToArray(r, e) {
  return (
    _arrayWithHoles(r) ||
    _iterableToArrayLimit(r, e) ||
    _unsupportedIterableToArray(r, e) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return (
      "Object" === t && r.constructor && (t = r.constructor.name),
      "Map" === t || "Set" === t
        ? Array.from(r)
        : "Arguments" === t ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
        ? _arrayLikeToArray(r, a)
        : void 0
    );
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _iterableToArrayLimit(r, l) {
  var t =
    null == r
      ? null
      : ("undefined" != typeof Symbol && r[Symbol.iterator]) || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (((i = (t = t.call(r)).next), 0 === l)) {
        if (Object(t) !== t) return;
        f = !1;
      } else
        for (
          ;
          !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l);
          f = !0
        );
    } catch (r) {
      (o = !0), (n = r);
    } finally {
      try {
        if (!f && null != t["return"] && ((u = t["return"]()), Object(u) !== u))
          return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function GreetingApp() {
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    name = _useState2[0],
    setName = _useState2[1];
  var _useState3 = useState(""),
    _useState4 = _slicedToArray(_useState3, 2),
    address = _useState4[0],
    setAddress = _useState4[1];
  var memoizedSetName = useMemo(
    function () {
      return function (e) {
        return setName(e.target.value);
      };
    },
    [name]
  );
  var memoizedSetAddress = useMemo(
    function () {
      return function (e) {
        return setAddress(e.target.value);
      };
    },
    [address]
  );
  return createElement(
    "div",
    null,
    createElement(
      "label",
      null,
      "Name: ",
      createElement("input", {
        value: name,
        onChange: memoizedSetName,
      })
    ),
    createElement(
      "label",
      null,
      "Address: ",
      createElement("input", {
        value: address,
        onChange: memoizedSetAddress,
      })
    ),
    createElement(MemoizedGreeting, {
      name: name,
    })
  );
}
var MemoizedGreeting = memo(Greeting);
function Greeting(_ref) {
  var name = _ref.name;
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  var _useState5 = useState(0),
    _useState6 = _slicedToArray(_useState5, 2),
    count = _useState6[0],
    setCount = _useState6[1];
  var increment = useMemo(
    function () {
      return function () {
        return setCount(count + 1);
      };
    },
    [count]
  );
  return createElement(
    "div",
    null,
    createElement("h3", null, name ? "Hello, ".concat(name, "!") : "Hello!"),
    createElement("p", null, "Count: ", count),
    createElement(
      "button",
      {
        onClick: increment,
      },
      "Increment"
    )
  );
}

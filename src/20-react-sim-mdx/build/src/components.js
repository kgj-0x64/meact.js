(() => {
  function GreetingApp() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const memoizedSetName = useMemo(
      () => (e) => setName(e.target.value),
      [name]
    );
    const memoizedSetAddress = useMemo(
      () => (e) => setAddress(e.target.value),
      [address]
    );
    return /* @__PURE__ */ createElement(
      "div",
      null,
      /* @__PURE__ */ createElement(
        "label",
        null,
        "Name: ",
        /* @__PURE__ */ createElement("input", {
          value: name,
          onChange: memoizedSetName,
        })
      ),
      /* @__PURE__ */ createElement(
        "label",
        null,
        "Address: ",
        /* @__PURE__ */ createElement("input", {
          value: address,
          onChange: memoizedSetAddress,
        })
      ),
      /* @__PURE__ */ createElement(MemoizedGreeting, { name })
    );
  }
  const MemoizedGreeting = memo(Greeting);
  function Greeting({ name }) {
    console.log(
      "Greeting was rendered at",
      /* @__PURE__ */ new Date().toLocaleTimeString()
    );
    const [count, setCount] = useState(0);
    const increment = useMemo(() => () => setCount(count + 1), [count]);
    return /* @__PURE__ */ createElement(
      "div",
      null,
      /* @__PURE__ */ createElement(
        "h3",
        null,
        name ? `Hello, ${name}!` : "Hello!"
      ),
      /* @__PURE__ */ createElement("p", null, "Count: ", count),
      /* @__PURE__ */ createElement(
        "button",
        { onClick: increment },
        "Increment"
      )
    );
  }
})();

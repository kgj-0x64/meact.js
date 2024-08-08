function App() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // memoize function so that it is not updated unnecessarily in browser DOM with same value of itself on paren't re-render
  const memoizedSetName = useMemo(
    () =>
      function (e) {
        setName(e.target.value);
      },
    [name]
  );
  const memoizedSetAddress = useMemo(
    () =>
      function (e) {
        setAddress(e.target.value);
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
    createElement(MemoizedGreeting, { name })
  );
}

const MemoizedGreeting = memo(Greeting);

function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());

  const [count, setCount] = useState(0);

  // useMemo is unnecessary here since this function is bound to be created every time Greeting renders
  const increment = useMemo(
    () => () => {
      setCount(count + 1);
    },
    [count]
  );

  return createElement(
    "div",
    null,
    createElement("h3", null, name ? `Hello, ${name}!` : "Hello!"),
    createElement("p", null, `Count: ${count}`),
    createElement("button", { onClick: increment }, "Increment")
  );
}

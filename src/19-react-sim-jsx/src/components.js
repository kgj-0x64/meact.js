// import Meact, { useState, useMemo, memo } from "meact";

function GreetingApp() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const memoizedSetName = useMemo(() => (e) => setName(e.target.value), [name]);
  const memoizedSetAddress = useMemo(
    () => (e) => setAddress(e.target.value),
    [address]
  );

  return (
    <div>
      <label>
        Name: <input value={name} onChange={memoizedSetName} />
      </label>
      <label>
        Address: <input value={address} onChange={memoizedSetAddress} />
      </label>
      <MemoizedGreeting name={name} />
    </div>
  );
}

const MemoizedGreeting = memo(Greeting);

function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());

  const [count, setCount] = useState(0);

  const increment = useMemo(() => () => setCount(count + 1), [count]);

  return (
    <div>
      <h3>{name ? `Hello, ${name}!` : "Hello!"}</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

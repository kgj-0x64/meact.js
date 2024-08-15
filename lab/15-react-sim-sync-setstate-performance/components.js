function Canvas() {
  console.log("Canvas function is called");

  const [pos1, setPos1] = useState({ x: 100, y: 100 });
  console.log("Canvas function has position", pos1);

  const [pos2, setPos2] = useState({ x: 0, y: 0 });
  console.log("Canvas function has pos2", pos2);

  useEffect(() => {
    console.log("Canvas useEffect called for handling pointer movement");
    function handleMove(e) {
      setPos1({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", handleMove);

    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useEffect(() => {
    console.log("Canvas useEffect called due to change in pos1", pos1);
    const handler = setTimeout(() => {
      console.log("Canvas setTimeout called", "so setting pos2 to", pos1);
      setPos2(pos1);
    }, 100);

    // ! this cleanup function must not be used since it could & would cancel the timeout even before it gets a chance to run
    // because `pos1` changes many times in 100ms due to pointer event listener
    // return () => clearTimeout(handler);
  }, [pos1]);

  return createElement(
    "div",
    null,
    createElement(Dot, {
      position: pos1,
      opacity: 1,
    }),
    createElement(Dot, {
      position: pos2,
      opacity: 0.8,
    })
  );
}

function Dot({ position, opacity }) {
  console.log("Dot component called with", position, opacity);

  return createElement("div", {
    class: "dot",
    style: `opacity:${opacity}; transform:translate(${position.x}px, ${position.y}px);`,
  });
}

function CanvasWithHooks() {
  console.log("CanvasWithHooks function is called");
  const pos1 = usePointerPosition();

  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 200);
  const pos5 = useDelayedValue(pos4, 200);

  return createElement(
    "div",
    null,
    createElement(Dot, {
      position: pos1,
      opacity: 1,
    }),
    createElement(Dot, {
      position: pos2,
      opacity: 0.75,
    }),
    createElement(Dot, {
      position: pos3,
      opacity: 0.5,
    }),
    createElement(Dot, {
      position: pos4,
      opacity: 0.33,
    }),
    createElement(Dot, {
      position: pos5,
      opacity: 0.2,
    })
  );
}

function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", handleMove);

    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return position;
}

function useDelayedValue(followingPosition, delay) {
  const [delayedValue, setDelayedValue] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(followingPosition);
    }, delay);
  }, [followingPosition, delay]);

  return delayedValue;
}

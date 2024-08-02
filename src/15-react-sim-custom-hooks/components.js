function Canvas() {
  console.log("Canvas function is called");
  const [pos1, setPos1] = useState({ x: 0, y: 0 });
  console.log("Canvas function has position", pos1);

  const [pos2, setPos2] = useState({ x: 100, y: 100 });
  console.log("Canvas function has pos2", pos2);

  useEffect(() => {
    console.log("Canvas useEffect called");
    function handleMove(e) {
      setPos1({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", handleMove);

    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  /**
   * ISSUE:
   *
   */
  useEffect(() => {
    console.log("Canvas useEffect called due to change in pos1", pos1);
    const handler = setTimeout(() => {
      console.log("Canvas setTimeout called");
      setPos2(pos1);
    }, 100);

    return () => clearTimeout(handler);
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

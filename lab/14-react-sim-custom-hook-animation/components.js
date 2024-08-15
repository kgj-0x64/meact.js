function App() {
  const [show, setShow] = useState(false);

  return createElement(
    "div",
    null,
    createElement(
      "button",
      { onClick: () => setShow(!show) },
      show ? "Remove" : "Show"
    ),
    createElement("hr"),
    show ? createElement(WelcomeAnimationUsingJs) : createElement(null)
  );
}

/**
 * CSS animation is working
 */
function WelcomeAnimationUsingCss() {
  return createElement("h1", { class: "welcome" }, "Welcome");
}

/**
 * Same animation is working using custom hooks too
 */
function WelcomeAnimationUsingJs() {
  const ref = useRef(null);

  useFadeIn(ref, 2000);

  return createElement("h1", { class: "welcome", refKey: ref }, "Welcome");
}

function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}

class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}

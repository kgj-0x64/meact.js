// EXAMPLE FROM: https://react.dev/reference/react/useEffect#examples-connecting

function App() {
  const [show, setShow] = useState(false);

  return createElement(
    "div",
    null,
    createElement("button", { onClick: () => setShow(true) }, "Open Dialog"),
    createElement(
      ModalDialog,
      { isOpen: show },
      "Hello there!",
      createElement("br"),
      createElement("button", { onClick: () => setShow(false) }, "Close Dialog")
    )
  );
}

function ModalDialog({ isOpen, children }) {
  const ref = useRef(null);
  console.log("ModalDialog ref", ref);

  useEffect(() => {
    console.log("Run setup function in ModalDialog's useEffect");

    if (!isOpen) {
      return;
    }

    console.log("Get the reference to dialog's DOM node", ref.current);
    const dialog = ref.current;
    dialog.showModal();

    return () => {
      console.log("Run cleanup function in ModalDialog's useEffect");
      dialog.close();
    };
  }, [isOpen]);

  return createElement("dialog", { refKey: ref }, ...children);
}

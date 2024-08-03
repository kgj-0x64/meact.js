function createTodos() {
  const todos = [];
  for (let i = 0; i < 5; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5,
    });
  }
  return todos;
}

const todos = createTodos();

function App() {
  const [tab, setTab] = useState("all");
  const [isDark, setIsDark] = useState(true);

  return createElement(
    "div",
    null,
    createElement("button", { onClick: () => setTab("all") }, "All"),
    createElement("button", { onClick: () => setTab("active") }, "Active"),
    createElement(
      "button",
      { onClick: () => setTab("completed") },
      "Completed"
    ),
    createElement("br"),
    createElement(
      "label",
      null,
      createElement("input", {
        type: "checkbox",
        checked: isDark,
        onChange: (e) => setIsDark(e.target.checked),
      }),
      `${isDark ? "Dark" : "Light"} mode`
    ),
    createElement("hr"),
    createElement(TodoList, {
      todos,
      tab,
      theme: isDark ? "dark" : "light",
    })
  );
}

function TodoList({ todos, theme, tab }) {
  console.log("TodoList component called", theme, tab);
  let visibleTodos = filterTodos(todos, tab);
  console.log("visibleTodos", visibleTodos);

  const VisibleTodos = () => {
    return visibleTodos.map((todo) =>
      createElement(
        "li",
        {
          key: todo.id,
        },
        todo.completed ? createElement("s", null, todo.text) : todo.text
      )
    );
  };
  console.log("VisibleTodos", VisibleTodos());

  return createElement(
    "div",
    { class: theme },
    createElement(
      "p",
      null,
      createElement(
        "b",
        null,
        "Note: ",
        createElement("code", null, "filterTodos"),
        " is artificially slowed down!"
      )
    ),
    createElement("ul", null, ...VisibleTodos())
  );
}

function filterTodos(todos, tab) {
  console.log(
    "[ARTIFICIALLY SLOW] Filtering " +
      todos.length +
      ' todos for "' +
      tab +
      '" tab.'
  );
  let startTime = performance.now();
  while (performance.now() - startTime < 2000) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter((todo) => {
    if (tab === "all") {
      return true;
    } else if (tab === "active") {
      return !todo.completed;
    } else if (tab === "completed") {
      return todo.completed;
    }
  });
}

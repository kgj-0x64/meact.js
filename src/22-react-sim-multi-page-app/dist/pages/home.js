import {
  jsx,
  jsxs,
  meact_default,
  useMemo,
  useState
} from "./chunk-J7AX4US4.js";

// app/utils.js
function createTodos() {
  const todos2 = [];
  for (let i = 0; i < 5; i++) {
    todos2.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos2;
}
function filterTodos(todos2, tab) {
  console.log(
    "[ARTIFICIALLY SLOW] Filtering " + todos2.length + ' todos for "' + tab + '" tab.'
  );
  let startTime = performance.now();
  while (performance.now() - startTime < 2e3) {
  }
  return todos2.filter((todo) => {
    if (tab === "all") {
      return true;
    } else if (tab === "active") {
      return !todo.completed;
    } else if (tab === "completed") {
      return todo.completed;
    }
  });
}

// app/components/TodoList.js
function TodoList({ todos: todos2, theme, tab }) {
  console.log("TodoList component called", theme, tab);
  const visibleTodos = useMemo(() => filterTodos(todos2, tab), [todos2, tab]);
  console.log("visibleTodos", visibleTodos);
  const VisibleTodos = () => {
    return visibleTodos.map((todo) => /* @__PURE__ */ jsx("li", { children: todo.completed ? /* @__PURE__ */ jsx("s", { children: todo.text }) : todo.text }, todo.id));
  };
  return /* @__PURE__ */ jsxs("div", { class: theme, children: [
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("b", { children: [
      '"Note: " ',
      /* @__PURE__ */ jsx("code", { children: '"filterTodos"' }),
      ' " is artificially slowed down!"'
    ] }) }),
    /* @__PURE__ */ jsx("ul", { children: VisibleTodos() })
  ] });
}

// app/components/TodoListContainer.js
var { createElement } = meact_default;
function TodoListContainer({ todos: todos2 }) {
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
        onChange: (e) => setIsDark(e.target.checked)
      }),
      `${isDark ? "Dark" : "Light"} mode`
    ),
    createElement("hr"),
    createElement(TodoList, {
      todos: todos2,
      tab,
      theme: isDark ? "dark" : "light"
    })
  );
}

// app/pages/home.js
var todos = createTodos();
function Page() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "This is the home page." }),
    /* @__PURE__ */ jsx(TodoListContainer, { todos })
  ] });
}
export {
  Page as default
};

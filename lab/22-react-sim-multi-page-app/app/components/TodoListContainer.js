import Meact, { useState } from "@meact";
import { TodoList } from "./TodoList";

const { createElement } = Meact;

export function TodoListContainer({ todos }) {
  const [tab, setTab] = useState("all");
  const [isDark, setIsDark] = useState(true);

  return createElement(
    "div",
    null,
    createElement(
      "button",
      { type: "button", name: "show-all", onClick: () => setTab("all") },
      "All"
    ),
    createElement(
      "button",
      { type: "button", name: "show-active", onClick: () => setTab("active") },
      "Active"
    ),
    createElement(
      "button",
      {
        type: "button",
        name: "show-completed",
        onClick: () => setTab("completed"),
      },
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

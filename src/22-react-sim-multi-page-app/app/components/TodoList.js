import { useMemo } from "@meact";
import { filterTodos } from "../utils";

export function TodoList({ todos, theme, tab }) {
  console.log("TodoList component called", theme, tab);

  // const visibleTodos = filterTodos(todos, tab);
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log("visibleTodos", visibleTodos);

  const VisibleTodos = () => {
    return visibleTodos.map((todo) => (
      <li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>
    ));
  };

  return (
    <div class={theme}>
      <p>
        <b>
          Note: <code>filterTodos</code> is artificially slowed down!
        </b>
      </p>
      <ul>{VisibleTodos()}</ul>
    </div>
  );
}

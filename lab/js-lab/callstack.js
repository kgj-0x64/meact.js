function logger(funcName, ...nestedFuncNames) {
  console.log("LOGGER:", funcName, nestedFuncNames);
  stack.push({ funcName, children: nestedFuncNames });
  return funcName;
}

function App() {
  console.log("COMPONENT:", "App");
  return logger(
    "App",
    logger("A", logger("AA"), logger("AB", logger("ABA"), logger("ABB"))),
    logger("AppProvider", logger("AppPA"), logger("AppPB")),
    logger("AppC"),
    Component()
  );
}

function Component() {
  console.log("COMPONENT:", "Component");
  return logger(
    "Component",
    logger("ComponentProvider", logger("ComponentPA"), logger("ComponentPB")),
    logger("ComponentC")
  );
}

stack = [];
logger(App());
console.log("Final Stack", stack);

import { glob } from "glob";
import path from "path";
import { writeFileSync } from "fs";
import {
  SERVER_API_DIRECTORY,
  MEACT_FRAMEWORK_SERVER_DIRECTORY,
} from "../constants/fileAndDirectoryNameAndPaths.js";

export async function buildMeactFrameworkServerSideHandlersMap() {
  console.log("Meact app's server side handlers have to be registered...");

  const routeFiles = glob.sync(`${SERVER_API_DIRECTORY}/*.{js,ts}`);

  const imports = [];
  const mapEntries = [];

  for (const file of routeFiles) {
    const fileName = file.endsWith(".js")
      ? path.basename(file, ".js")
      : path.basename(file, ".ts");

    const importPath = path.join("../..", file).replace(/\\/g, "/"); // Make the path relative and compatible with all OS

    const importStatementForThisFile = `import * as ${fileName} from "${importPath}";`;
    imports.push(importStatementForThisFile);

    // Dynamically import the module
    const fileModule = await import(importPath); // relative path

    // sanity check
    if (!("componentName" in fileModule)) {
      throw new Error(
        `server/api/${file} is missing export of "componentName" value`
      );
    }

    const fileModuleExports = ["componentName", "meta", "loader", "action"]
      .filter((name) => name in fileModule)
      .map((exportedName) => `${exportedName}: ${fileName}.${exportedName},`);

    const mapEntry = `[
      ${
        fileName.startsWith("_") ? `${fileName}.componentName` : `"${fileName}"`
      },
      {
        ${fileModuleExports.join("\n")}
      },
    ],`;

    mapEntries.push(mapEntry);
  }

  const outputContent = `
    /**
      * 
      * ! DON'T EDIT Directly!!!
      * Generated by running framework.build.ts
      *  
    */
    ${imports.join("\n")}

    export const mapOfComponentNameToServerSideHandlers = new Map([
      ${mapEntries.join("\n")}
    ]);
  `;

  // takes path relative to the root directory
  writeFileSync(
    path.join(MEACT_FRAMEWORK_SERVER_DIRECTORY, "build.js"),
    outputContent.trim()
  );

  console.log(
    "Meact app's server side handlers have been registered successfully."
  );
}

buildMeactFrameworkServerSideHandlersMap()
  .then(() => {
    console.log("Successfuly built Meact app's server-side handlers map");
    process.exit(); // Explicitly terminate the process
  })
  .catch((err) => {
    console.error(
      "Error in building Meact app's server-side handlers map:",
      err
    );
    process.exit(1); // Exit with a non-zero status code on error
  });
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get the current file path and directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// absolute path of meact library's directory
const meactLibDirectoryName = "meact";
export const meactLibDirectory = join(__dirname, meactLibDirectoryName);

// absolute path of pages directory
const appDirectoryName = "app";
export const appDirectory = join(__dirname, appDirectoryName);
export const indexHtmlPath = join(appDirectory, "index.html");
export const appPagesDirectory = join(appDirectory, "pages");

// Define the absolute path where the bundled script output will be saved
const buildOutputDirectoryName = "dist";
export const buildOutputDirectory = join(__dirname, buildOutputDirectoryName);
export const buildOutputPagesDirectory = join(buildOutputDirectory, "pages");

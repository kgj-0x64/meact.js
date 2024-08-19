/**
 * call this on server to prepare index.html content in response to a page request
 * @param {string} html
 * @param {string} stylesheetBundlePath
 * @param {string} scriptBundlePath
 * @returns {string}
 */
export function prepareHtmlForPageRequest(
  html,
  stylesheetBundlePath,
  scriptBundlePath
) {
  try {
    // Replace the placeholder values in the HTML
    html = html.replaceAll("$stylesheetBundlePath", stylesheetBundlePath);
    html = html.replaceAll("$scriptBundlePath", scriptBundlePath);
    return html;
  } catch (error) {
    console.error("An error occurred while loading assets:", error);
  }
}

/**
 * call this on server to prepare index.html content in response to a page request
 * @param {string} html
 * @param {string} scriptBundlePath
 * @param {string | null} stylesheetBundlePath
 * @returns {string}
 */
export function prepareHtmlForPageRequest(
  html,
  scriptBundlePath,
  stylesheetBundlePath
) {
  try {
    // Replace the placeholder values in the HTML
    html = html.replaceAll(
      "$stylesheetBundlePath",
      stylesheetBundlePath ? stylesheetBundlePath : ""
    );
    html = html.replaceAll("$scriptBundlePath", scriptBundlePath);
    return html;
  } catch (error) {
    console.error("An error occurred while loading assets:", error);
  }
}

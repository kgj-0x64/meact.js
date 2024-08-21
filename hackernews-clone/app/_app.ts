export function runExtraLoadersFromComponentsForThisPage(
  pageName: string
): string[] {
  if (getLayoutComponentForThisPage(pageName) === "main-layout")
    return ["MainLayout"];
  return [];
}

function getLayoutComponentForThisPage(pageName: string): string {
  const underBlankLayout = ["dmca", "forgot", "login"];
  const underNoticeLayout = [
    "showhn",
    "security",
    "newswelcome",
    "newsguidelines",
    "newsfaq",
    "bookmarklet",
  ];

  if (underBlankLayout.includes(pageName)) return "blank-layout";
  if (underNoticeLayout.includes(pageName)) return "notice-layout";
  return "main-layout";
}

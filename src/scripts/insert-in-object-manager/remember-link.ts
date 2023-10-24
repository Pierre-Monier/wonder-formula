import data from "./data";

// Used to do a better redirection when the user switches tabs
export const rememberCurrentLink = (ul: Element) => {
  const latestCurrentLink = localStorage.getItem(data.currentLinkKey);

  const currentLink = ul.querySelector(".currentTab a")?.getAttribute("title");

  localStorage.setItem(data.currentLinkKey, currentLink || "");

  return !latestCurrentLink || latestCurrentLink === currentLink;
};


// Find an HTML element
export function qs(
  selector: string,
  parent: Document | Element = document
): Element | null {
  return parent.querySelector(selector);
}

// Retrieve data from local storage
export function getLocalStorage(key: string) {
  const data = localStorage.getItem(key);

  if (data === null) {
    return null;
  }

  return JSON.parse(data);
}

// Save data to local storage
export function setLocalStorage(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Define the event handler type
interface ClickHandler {
  (e: Event): void;
}

// Set click and touch listeners
export function setClick(
  selector: string,
  callback: ClickHandler
): void {
  const element = qs(selector);

  element?.addEventListener("touchend", (event: Event) => {
    event.preventDefault();
    callback(event);
  });

  element?.addEventListener("click", callback);
}

// Open and close the user menu
export function openUserMenu(selector: string): void {
  setClick(selector, (e: Event) => {
    e.stopPropagation();

    const menu = document.querySelector(".user__menu");
    menu?.classList.toggle("open");
  });

  setClick("body", () => {
    const openMenus = document.querySelectorAll(".open");

    openMenus.forEach((element: Element) => {
      element.classList.remove("open");
    });
  });
}
export function getParam(param: string): string | null {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);

  return value;
}
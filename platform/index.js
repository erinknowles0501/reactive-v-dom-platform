import { printDevConsoleMsg } from "./helpers/devConsole.js";

export default class Platform {
  // constructor(definition, options, plugins) {
  constructor(mountElementId, topComponent) {
    // using querySelector so when defining a Platform instance, the DX is that it's obviously a DOM element.
    const appElement = document.querySelector(mountElementId);

    if ([...String(mountElementId)][0] !== "#") {
      printDevConsoleMsg(`Mount element must be a DOM id, with the form '#id'`);
      return;
    }

    if (!appElement) {
      printDevConsoleMsg(`Could not find element with id '${mountElementId}'`);
      return;
    }

    appElement.style.border = "2px solid red";

    // Here we go!!
    appElement.appendChild(topComponent.parseAndRender());
  }
  // data
  // methods:

  // constructor is also where options and plugins are passed.
}

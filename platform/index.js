import { printDevConsoleMsg } from "./helpers/devConsole.js";

export default class Platform {
  // constructor(definition, options, plugins) {
  constructor(mountElementId, component) {
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

    // compile - need to get access to the #app div and go from there.
    // actually render() might be called here and will propagate down from there.
    // also needs an element to bind to, and a component to act as top-level.
  }
  // data
  // methods:

  // constructor is also where options and plugins are passed.
}

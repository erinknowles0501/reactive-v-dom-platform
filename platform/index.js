import { printDevConsoleMsg } from "./helpers/devConsole.js";
import TemplateParser from "./services/templateParser.js";
import PlatformElement from "./element.js";

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

    // compile - need to get access to the #app div and go from there.
    // actually render() might be called here and will propagate down from there.
    // also needs an element to bind to, and a component to act as top-level.

    // parse template from top to bottom here:
    //topComponent.element = new PlatformElement(
    TemplateParser.parseTemplate(topComponent.rawTemplate, topComponent); // this is only ever called from here so we can pass the component as the arg
    //);

    // Here we go!!
    appElement.appendChild(topComponent.element.render());
  }
  // data
  // methods:

  // constructor is also where options and plugins are passed.
}

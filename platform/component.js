import simpleId from "./helpers/simpleId.js";
import Reactable from "./reactable.js";
import { printDevConsoleMsg } from "./helpers/devConsole.js";

export default class Component {
  static INVALID_TAG_STRING = "[object HTMLUnknownElement]";
  static PLATFORM_ATTRIBUTES = ["p-for", "p-if"]; // p-bind, p-key...

  constructor(info) {
    // setting up with object instead of array - more future-proof
    ({
      name: this.name,
      data: this.data = {},
      template: this.template,
      props: this.props = [],
      components: this.components = [],
    } = info);
    this.id = simpleId();

    if (!this.name || !this.template) {
      printDevConsoleMsg(`Components need at least a name and a template.`);
    }

    this.topElement = null; // reference to its top-level DOM element.
    this.children = []; // nested array of its DOM children, down to the 'next' component/s.

    this.propElements = []; // key-value pairs - reactiveVar: DOMElements that use that var. Should be direct referneces to elements in this.children.

    //this.generateReactiveData(); // TODO: Figure out why this is being called twice.
  }

  generateReactiveData() {
    // Should only run once per component, on initialization.
    const vm = this;

    console.log("running generateReactiveData...");
    Object.keys(vm.data).map(function (key) {
      const originalKey = key;
      key = `_${key}`;

      const reactable = new Reactable(vm.data[originalKey]);
      this.reactables[originalKey] = reactable;

      Object.defineProperty(vm.data, originalKey, {
        get() {
          return vm.data[key];
        },
        set(newVal) {
          console.log("set newval: propelements", vm.propElements);
          // if (vm.propElements[originalKey]) {
          //   console.log(
          //     "have an element with this prop: ",
          //     vm.propElements[originalKey],
          //     originalKey
          //   );
          //   vm.updatePropValue(key, newVal, vm.propElements[originalKey]);
          // }
          reactable.updateBy(originalKey, newVal);
          console.log("reactivated", key, newVal);
        },
      });

      // console.log("this after reactive generation: ", vm);
    });
  }

  parseText(platformElement, newValues = null) {
    // parses {{ }} template to {
    //   strings: [ Strings ],
    //   props: [ propKeys ]
    // }
    // and then ...?

    const rawText = platformElement.rawText;
    const elementId = platformElement.id;

    console.log("rawtext, el id", rawText, elementId);

    const strings = rawText
      .replace("\n", "")
      .replace("  ", "")
      .split(/{{.*?}}/gi); // my very first homebrew regex...!

    let propList = rawText.match(/{{.*?}}/gi);
    if (!!propList) {
      propList = propList.map((item) => item.replace(/{{|}}/gi, "").trim());
      propList.forEach((prop) => {
        // TODO: Don't generate these every time...
        this.props[prop] = this.reactive[`_${prop}`];
        this.propElements[prop] = platformElement;
      });
    }

    // TODO......
    let string = "";
    strings.forEach((str, index) => {
      string += str;

      if (index !== strings.length - 1 && propList) {
        if (!newValues) {
          string += this.props[propList[index]];
          return;
        }
        string += newValues[index];
      }
    });

    return string;
  }

  // updatePropValue(key, newVal, element) {
  //   // Only ever called in a forEach so it's only ever one prop
  //   console.log("info from updatePropValue: ", key, newVal);
  //   this.data[key] = newVal;
  //   const updatedParsedText = this.parseText(element, [newVal]);
  //   console.log("updatedParsedText", updatedParsedText);
  //   console.log("rendered element", element.renderedElement);
  //   element.renderedElement.innerText = updatedParsedText; // TODO: Can 'cache' this search by updating the children list, replacing this id with its element
  // }

  generateTargetFunctions(element) {
    // If an element is dynamic (ie might change due to a prop's value) we need to generate functions to run
    // when that prop updates, to specifically update that element. (Element = the target)
    // We can assume any element passed here is dynamic.
    // 1. Get the dynamic part/s of the element - the p-for, the p-if, the {{ }} string, etc.
    // 2. Set the target function/s type based on that
    // 3. Generate the function based on the type
    // 3. Register the function/s with the appropriate Reactable/s
  }

  parseAndRender() {
    // Parse this component's "block" of elements (until the next component, which has this called on it, etc.)
    // DOMParser happens to return the full DOM element, all that we need to do is attach it.
    // Needs to build out this.children - a nested array of DOM elements
    // Returns this.topElement (to be appended)

    const parser = new DOMParser();
    const HTMLElement = parser.parseFromString(this.template, "text/html").body
      .firstElementChild; // TODO when implementing text nodes: Node.firstChild

    if (!HTMLElement) {
      printDevConsoleMsg(
        `Could not parse template to usable HTMLElement: `,
        this.template
      );
    }

    console.log(
      "START PARSING TEMPLATE: %c",
      "color: blue; font-size: 16px",
      this.name
    );

    HTMLElement.dataset.platformId = this.id;
    HTMLElement.butt = true;
    console.log(HTMLElement);
    this.topElement = HTMLElement;

    // We know that a component has at least one child
    if (!HTMLElement.children.length) {
      printDevConsoleMsg(`Component ${this.name} cannot be empty.`);
    }

    this.children = Array.from(HTMLElement.children); // TODO: What refernece does this break?

    // Replace anything beneath a component with that component
    // Also flag any dynamic elements to generate target functions from
    this.children = this.children.map((domChild) => {
      const isDynamic =
        domChild.getAttributeNames().some((attr) => {
          return this.constructor.PLATFORM_ATTRIBUTES.includes(attr);
        }) || !!domChild.innerText.match(/{{.*?}}/gi);
      console.log("is dynamic?", isDynamic);

      const isComponent =
        domChild.toString() === this.constructor.INVALID_TAG_STRING;

      if (isComponent) {
        domChild = this.components.find(
          (component) =>
            component.name.toUpperCase === domChild.tagName.toUpperCase
        );
        domChild = domChild.parseAndRender();
      }

      return domChild;
    });

    console.log("FINISHED PARSING TEMPLATE", this.name, this.children);

    // TODO: build Reactable targets.
    // Will need to parse (tag function) string,
    // ...
    // save type...
    // will take form of storing what element it is (don't need to e

    this.children.forEach((child) => {
      this.topElement.appendChild(child);
    });

    return this.topElement;
  }
}

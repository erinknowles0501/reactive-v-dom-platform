import simpleId from "./helpers/simpleId.js";

export default class Component {
  constructor(info) {
    // will need to call seal() or similar at some point. TODO

    // setting up with object instead of array - more future-proof
    ({ name: this.name, data: this.data, template: this.template } = info);
    this.id = simpleId();

    this.topElement = null;
    this.children = []; // nested array of ids of its children (if we parsed to platformElements instead it would just be them.)
    this.reactive = {}; // not into this implementation TODO
    this.props = {};
    this.propElements = []; // key-value pairs - reactiveVar: [PlatformElement()] that use that var. Should be direct referneces to elements in this.element.

    this.generateReactiveData(); // TODO: Figure out why this is being called twice.
  }

  generateReactiveData() {
    const vm = this;

    console.log("am for-eaching this.data for generateReactiveData...");
    Object.entries(vm.data).forEach(function ([key, val]) {
      // there's a better way than forEach
      // TODO: LOOK AT THIS TOMORROW>

      const underscoredKey = `_${key}`;
      vm.reactive[underscoredKey] = val;
      //vm.reactive[underscoredKey] = Symbol(); // TODO: This is supposed to create real privacy for these keys. Look into.

      Object.defineProperty(vm.reactive, key, {
        get() {
          return vm.reactive[underscoredKey];
        },
        set(newVal) {
          console.log("set newval: popelements", vm.propElements);
          if (vm.propElements[key]) {
            console.log(
              "have an element with this prop: ",
              vm.propElements[key],
              key
            );
            vm.updatePropValue(key, newVal, vm.propElements[key]);
          }
          vm.reactive[underscoredKey] = JSON.parse(JSON.stringify(newVal)); // deep clone this...? On the one hand would introduce
          // JSON-parsing issues like number-strings being converted to numbers. On
          // the other hand, don't save numbers as strings (and this will avoid some weird reactivity-issues).
          // I can't remember encountering any other JSON-parsing issues. TODO: Look up whether this is even needed.
          console.log("reactivated", key, newVal);
        },
      });

      // console.log("this after reactive generation: ", vm);
    });
  }

  parseText(platformElement, newValues = null) {
    // parses {{ }} template and then passes it directly
    // to a (tag, basically) function which then is re-run when those vars update.

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

  updatePropValue(key, value, element) {
    // Only ever called in a forEach so it's only ever one prop
    console.log("info from updatePropValue: ", key, value);
    this.reactive[key] = value;
    const updatedParsedText = this.parseText(element, [value]);
    console.log("updatedParsedText", updatedParsedText);
    console.log("rendered element", element.renderedElement);
    element.renderedElement.innerText = updatedParsedText; // TODO: Can 'cache' this search by updating the children list, replacing this id with its element
  }

  parseAndRender() {
    // Parse this component's "block" of elements (until the next component, which has this called on it, etc.)
    // DOMParser happens to return the full DOM element, all that we need to do it attach it.
    // Needs to build out this.elements - a nested array of DOM elements.
    // Return this.elements.

    const parser = new DOMParser();
    const HTMLElement = parser.parseFromString(this.template, "text/html").body
      .children[0]; // TODO There's probably a better HTML API method for this

    console.log(
      "START PARSING TEMPLATE: %c",
      "color: blue; font-size: 16px",
      HTMLElement.tagName
    );

    this.topElement = HTMLElement;

    // Because I'm cheating for now and wrapping all text in a tag,
    // if the HTMLElement has any children, then this is a container node
    // TODO: Might be able to capture TextNode in the future.
    if (!!HTMLElement.children.length) {
      // It's a container - no text, and it has children

      this.children = Array.from(HTMLElement.children);

      // Now remove anything after a component and call parse on that component.

      Array.from(HTMLElement.children).forEach((domChild) => {
        if (
          document.createElement(domChild.tagName.toUpperCase()).toString() ==
          "[object HTMLUnknownElement]" // const this TODO // OR, give data- attrs = 'platformcomponent' or watever
        ) {
          // Get the actual component instance (as defined in /components) so that component 'owns' itself,
          // like the topComponent does. // TODO
          // TODO: In the meantime, just create component and pass it what it needs...?
          // All we need to add to this.children here is the component as a reference, but not even, because the render chain
          // should pass right through it. Ideally we'd add component to the this.children and THEN call .render() on it.
        }
      });
    } else {
      // no chillens! It has text, then.
      // platformElement.rawText = HTMLElement.textContent; // need this for re-parsing, unless we save the strings/props...
      //platformElement.text = this.parseText(platformElement); // Rewrite parseText - it doesn't need the whole element, it should just get strings and props.
    }

    console.log(
      "FINISHED PARSING TEMPLATE",
      HTMLElement.tagName,
      this.children
    );

    // TODO: Dev errors all through here, so many things to go wrong
    // TODO for attrs props events and so forth

    console.log("%c START RENDER: ", "color: red; font-size: 16px", this.name);

    this.children.forEach((child) => {
      console.log("child", child);
      this.topElement.appendChild(child);
    });

    console.log("%c END RENDER ", "color: red; font-size: 16px", this.name);

    return this.topElement;
  }
}

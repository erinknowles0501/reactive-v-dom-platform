import PlatformElement from "./element.js";

export default class Component {
  constructor(info) {
    // will need to call seal() or similar at some point. TODO

    // setting up with object instead of array - more future-proof
    // this.name = info.data; // should match import file
    // this.data = info.data;
    // this.template = info.template;

    ({ name: this.name, data: this.data, template: this.template } = info);

    this.element = null;
    this.reactive = {}; // not into this implementation TODO
    this.props = {};
    this.propElements = []; // key-value pairs - reactiveVar: [PlatformElement()] that use that var. Should be direct referneces to elements in this.element.

    this.generateReactiveData();

    //this.parseTemplate();

    // this.element.props = Object.values(this.data).map((item) => {
    //   return item;
    // });
    // console.log("this element props", this.element.props);

    // TODO: See if not using an arrow function lets you use 'this' here
    // const vm = this;
    // topElement.propNames.forEach((prop) => {
    //   vm.propElements[prop] = topElement;
    // });
  }

  runLifecycle() {
    // TODO: Not yet :)
  }

  generateReactiveData() {
    const vm = this;

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
          if (vm.propElements[key]) {
            console.log("have an element with this prop");
            vm.propElements[key].updatePropValue(key, newVal);
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

  parseText(rawText) {
    // parses {{ }} template and then passes it directly
    // to a (tag, basically) function which then is re-run when those vars update.

    console.log("this rawtext", rawText);

    const strings = rawText
      .replace("\n", "")
      .replace("  ", "")
      .split(/{{.*?}}/gi); // my very first homebrew regex...!

    let props = rawText.match(/{{.*?}}/gi);
    if (!!props) {
      props = props.map((item) => item.replace(/{{|}}/gi, "").trim());
      props.forEach((prop) => {
        this.props[prop] = this.reactive[`_${prop}`];
      });
    }

    // TODO: This part
    let string = "";
    strings.forEach((str, index) => {
      string += str;

      if (index !== strings.length - 1 && props) {
        string += this.props[props[index]];
      }
    });
    return string;
  }

  updatePropValue(key, value) {
    // Only ever called in a forEach so it's only ever one prop
    this.props[key] = value;
    this.generateText();
  }

  parseTemplate(template) {
    // Okay so the parse chain works like this - the platform starts it by calling it on the top component,
    // the top component goes through all its children and creates an array of PlatformElements with their
    // domInfo (this is for rendering, later) and then a reference to the NEXT component/s it comes across.
    // Then it calls parse on that component (components).
    /*
       So for example,
       [ Div, [ P, ItemComponent ], Button, FooterComponent ]
    */
    // Okay sure but how is this reference used when rendering?
    // if children,
    // Wait what if it's just the component itself? required()
    // And then the upper component calls parse on them, and then return their part of the array, all the way up.
    // Ah god here we go

    const domInfo = {
      tag: "",
      attrs: null,
      children: [],
      text: "",
      rawText: "", // needs to be saved so it can be re-parsed when it changes.
      // events: [], // going to have to capture them somehow a la @click
    }; // define this as a const somewhere since its used here and in the element.....unless this IS the only place it needs to be defined

    const parser = new DOMParser();
    const HTMLElement = parser.parseFromString(template, "text/html").body
      .children[0];

    domInfo.tag = HTMLElement.tagName;
    domInfo.attrs = HTMLElement.attributes; // TODO: maybe map these for easier access

    // Because I'm cheating for now and wrapping all text in a tag,
    // if the innerTemplate has any children, then this is a container node
    if (!!HTMLElement.children.length) {
      Array.from(HTMLElement.children).forEach((domChild) => {
        if (
          document.createElement(domChild.tagName.toUpperCase()).toString() !=
          "[object HTMLUnknownElement]" // const this TODO
        ) {
          // It's not a component.
          const vm = this;
          const platformChild = new PlatformElement(
            vm.parseTemplate(domChild.outerHTML)
          );
          domInfo.children.push(platformChild);
        } else {
          // It IS a component.
          // TODO.
          console.log("compnoent!", domChild);
        }
      });
    } else {
      // no chillens! It has text, then.
      domInfo.rawText = HTMLElement.textContent;
      domInfo.text = this.parseText(HTMLElement.textContent);
    }
    console.log("dominfo", domInfo);

    this.element = new PlatformElement(domInfo);

    return domInfo;
  }

  // parseComponent() {
  //   // gets top level element from component template.
  // }

  // @emit
  // generate unique (ish) id
}

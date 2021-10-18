import PlatformElement from "./element.js";
import simpleId from "./helpers/simpleId.js";

export default class Component {
  constructor(info) {
    // will need to call seal() or similar at some point. TODO

    // setting up with object instead of array - more future-proof
    ({ name: this.name, data: this.data, template: this.template } = info);

    this.topElement = null;
    this.reactive = {}; // not into this implementation TODO
    this.props = {};
    this.propElements = []; // key-value pairs - reactiveVar: [PlatformElement()] that use that var. Should be direct referneces to elements in this.element.

    this.generateReactiveData();

    // this.element.props = Object.values(this.data).map((item) => {
    //   return item;
    // });
    // console.log("this element props", this.element.props);
  }

  runLifecycle() {
    // TODO: Not yet :)
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
          if (vm.propElements[key]) {
            console.log(
              "have an element with this prop: ",
              vm.propElements[key],
              key
            );
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

    let propList = rawText.match(/{{.*?}}/gi);
    if (!!propList) {
      propList = propList.map((item) => item.replace(/{{|}}/gi, "").trim());
      propList.forEach((prop) => {
        this.props[prop] = this.reactive[`_${prop}`];
      });
    }

    // TODO
    let string = "";
    strings.forEach((str, index) => {
      string += str;

      if (index !== strings.length - 1 && propList) {
        string += this.props[propList[index]];
      }
    });
    return string;
  }

  updatePropValue(key, value) {
    // Only ever called in a forEach so it's only ever one prop
    this.props[key] = value;
    this.generateText();
  }

  parseTemplate(template, iteration = 0) {
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
      id: simpleId(),
    }; // define this as a const somewhere since its used here and in the element.....unless this IS the only place it needs to be defined

    const parser = new DOMParser();
    const HTMLElement = parser.parseFromString(template, "text/html").body
      .children[0]; // TODO There's probably a better HTML API method for this

    domInfo.tag = HTMLElement.tagName;
    console.log(
      "%c START PARSE NEW TEMPLATE: ",
      "color: lime; font-size: 16",
      domInfo.tag,
      iteration
    );
    domInfo.attrs = HTMLElement.attributes; // TODO: maybe map these for easier access

    // Because I'm cheating for now and wrapping all text in a tag,
    // if the HTMLElement has any children, then this is a container node
    // TODO: Might be able to capture TextNode in the future.
    if (!!HTMLElement.children.length) {
      // It's a container - no text, and it has children
      Array.from(HTMLElement.children).forEach((domChild, index) => {
        if (
          document.createElement(domChild.tagName.toUpperCase()).toString() !=
          "[object HTMLUnknownElement]" // const this TODO
        ) {
          // It's not a component.
          const childInfo = this.parseTemplate(
            domChild.outerHTML,
            iteration + 1
          );
          console.log(
            "tag index, child tag: ",
            domInfo.tag,
            index,
            childInfo.tag
          );
          domInfo.children.push(childInfo);
        } else {
          // It IS a component.
          // TODO.
          console.log("compnoent!", domChild);
        }
      });
    } else {
      // no chillens! It has text, then.
      domInfo.rawText = HTMLElement.textContent; // need this for re-parsing, unless we save the strings/props...
      domInfo.text = this.parseText(HTMLElement.textContent);
    }
    //console.log("dominfo", domInfo);

    // If this is the very first iteration, ie we're at the top
    if (iteration === 0) {
      console.log("parseing iteration 0, dominfo: ", domInfo);
      this.topElement = new PlatformElement(domInfo);
    }

    //this.element = new PlatformElement(domInfo);
    console.log("FINISHED PARSING TEMPLATE", domInfo.tag, domInfo);
    return domInfo;
  }

  // parseComponent() {
  //   // gets top level element from component template.
  // }

  // @emit
  // generate unique (ish) id
}

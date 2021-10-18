import PlatformElement from "./element.js";

export default class Component {
  constructor(info) {
    // will need to call seal() or similar at some point. TODO

    // setting up with object instead of array - more future-proof
    this.name = info.data; // should match import file
    this.data = info.data;
    this.rawTemplate = info.template;

    this.element = null;
    this.reactive = {}; // not into this implementation TODO
    this.propElements = []; // key-value pairs - reactiveVar: [PlatformElement()] that use that var.

    this.generateReactiveData();

    // this.element.props = Object.values(this.data).map((item) => {
    //   return item;
    // });
    // console.log("this element props", this.element.props);

    // parse template:
    // <MyComponent /> // call MyComponent().render()....? or have mycomponent call render function from constructor?
    // <MyComponent v-model="data" />
    // <MyComponent :text="hello!" />
    // <MyComponent>Slot content??</MyComponent>
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
            vm.propElements[key].updatePropValue(key, newVal);
          }
          vm.reactive[underscoredKey] = JSON.parse(JSON.stringify(newVal)); // deep clone this...? On the one hand would introduce
          // JSON-parsing issues like number-strings being converted to numbers. On
          // the other hand, don't save numbers as strings (and this will avoid some weird reactivity-issues).
          // I can't remember encountering any other JSON-parsing issues. TODO: Look up.
          console.log("reactivated", vm.reactive, key, newVal);
        },
      });

      // console.log("this after reactive generation: ", vm);
    });
  }

  parseTemplate() {
    // This should be parseComponent or something.
    //
    // Render takes what it's given, creates elements, and assigns them values and properties.
    // This function, then, needs to take a template - either a string, or a tag function - and turn it into something
    // Render() can read to create the elements and assign them values and properties. An Element class.
    // Does each Element parse itself going down the chain..?
    // and give information about where its text needs to be reactive? And then when Element.update([vals]) is called, it'll update
    // its text value string based on the vals passed to it. | should be more like val.set() runs valElements[val].foreach(update(val) or ish.
    // Okay so an Element needs to be created knowing which attributes it has, what style it has, its tag, its text+vars...
    // Then render will go back down and back up rendering them.
    //
    // const topElement = new PlatformElement(this.rawTemplate);
    // this.element = topElement;
    //this.parseChain = topElement.parseTemplate();
    // TODO: See if not using an arrow function lets you use 'this' here
    // const vm = this;
    // topElement.propNames.forEach((prop) => {
    //   vm.propElements[prop] = topElement;
    // });
  }

  parseComponent() {
    // gets top level element from component template.
  }

  // @emit
  // generate unique (ish) id
}

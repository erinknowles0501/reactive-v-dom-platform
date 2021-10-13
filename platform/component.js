import Element from "./element.js";

export default class Component {
  constructor(info) {
    // will need to call seal() or similar at some point.

    // setting up with object instead of array - more future-proof
    this.data = info.data;
    this.templateRaw = info.template;
    this.reactive = {};
    this.propElements = []; // key-value pairs - reactiveVar: [Element()] that use that var.

    this.parseTemplate();

    this.generateReactiveData();

    this.reactive.greeting = "false!!";

    // parse template:
    // <MyComponent /> // call MyComponent().render()....? or have mycomponent call render function from constructor?
    // <MyComponent v-model="data" />
    // <MyComponent :text="hello!" />
    // <MyComponent>Slot content??</MyComponent>
  }

  runLifecycle() {
    // TODO: Only when determined it's required :)
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
        },
      });

      console.log("this after reactive generation: ", vm);
    });
  }

  parseTemplate() {
    // possible: template itself updates whenever the values passed to it update. This would mean parsing the template anew
    // each time though. But there's also: pass a tag function, and generate setters that set the reactive data alone, without
    // re-creating the elements.
    // The actual rendering happens in render(). Maybe this function creates a.....map...? Of parsed
    // This generates the virtual DOM, no?
    // Render takes what it's given, creates elements, and assigns them values and properties.
    // This function, then, needs to take a template - either a string, or a tag function - and turn it into something
    // Render() can read to create the elements and assign them values and properties. An Element class.
    // ....do we even need an Element class? What does the element need to do? Does each Element parse itself going down the chain..?
    // and give information about where its text needs to be reactive? And then when Element.update([vals]) is called, it'll update
    // its text value string based on the vals passed to it. | should be more like val.set() runs valElements[val].foreach(update(val) or ish.
    // Okay so an Element needs to be created knowing which attributes it has, what style it has, its tag, its text+vars...
    // this.template ...
    // return...

    const element = new Element(this.templateRaw); // should actually be text... unless this template-parsing happens in Element.
    const vm = this;

    // TODO: See if not using an arrow function lets you use 'this' here
    element.propNames.forEach((prop) => {
      vm.propElements[prop] = element;
    });
    console.log("this propelements", this.propElements);
  }

  render() {
    // Gets a (nested) list of elements that know their tag, text, props, etc.
    // Turns them into DOM elements.
  }

  // @emit
  // generate unique (ish) id
}

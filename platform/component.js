export default class Component {
  constructor(info) {
    // setting up with object instead of array - more future-proof
    this.data = info.data;
    this.generateTemplate(info.template);

    this.generateReactiveData();

    console.log(this);

    // parse template:
    // <MyComponent /> // call MyComponent().render()....? or have mycomponent call render function from constructor?
    // <MyComponent v-model="data" />
    // <MyComponent :text="hello!" />
    // <MyComponent>Slot content??</MyComponent>
  }

  generateTemplate(template) {
    // parses {{ }} template and then passes it directly
    // to a tag function which then is re-run when those vars update.

    const strings = template.split(/{{.*?}}/gim); // my very first homebrew regex...!
    const vars = template
      .match(/{{.*?}}/gim)
      .map((item) => item.replace(/{{|}}/gim, "").trim()); // very second!!

    console.log(strings, vars);

    // How to identify
  }

  runLifecycle() {
    // TODO: Only when determined it's required :)
  }

  generateReactiveData() {
    // .....data is already be a function...
    // iterate over data property and create a getter+setter method for each.....?
    // what's a better way to do this?

    const vm = this;

    Object.entries(this.data).forEach(function ([key, val]) {
      const tempVal = JSON.parse(JSON.stringify(val));

      vm[key] = {
        get() {
          return tempVal;
        },
        set(newVal) {
          vm[key] = JSON.parse(JSON.stringify(newVal)); // deep clone this...? On the one hand would introduce
          // JSON-parsing issues like number-strings being converted to numbers. On
          // the other hand, don't save numbers as strings. I can't remember encountering
          // any other JSON-parsing issues. TODO: Look up.
        },
      };
      console.log(vm);
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
    // its text value string based on the vals passed to it.
    // Okay so an Element needs to be created knowing which attributes it has, what style it has,
    // this.template ...
    // return...
  }

  render() {
    // Render chain.
    // Calls parseTemplate();

    // creates elements one by one (based on parseTemplate...)
    // gives them styles and attributes
    // gives them a text value (should any reactive text already be parsed to string? No. Don't want to have to re-call
    // render chain for each reaction!! So. Reactive text is NOT parsed, render function creates specific setters that just update
    // the text of the element. Maybe even only update it at certain string positions! No that's crazy
    //

    this.parseTemplate();
  }

  // methods:
  // run lifecycle hooks in order
  // has data
  // parse to vdom..?
  // have methods
  // @emit
  // generate unique (ish) id
}

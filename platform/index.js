// will export the platform to be used in the main app.

export default class Platform {
  constructor(definition, options, plugins) {
    //this.targetElement = definition.element;

    // init by connecting to index.html's #app and starting render chain
    const appElement = document.getElementById("app");
    // appElement.style.color = "red";
    console.log("sdgs");
  }
  // data
  // methods:
  // parse template:
  // <MyComponent /> // call MyComponent().render()....? or have mycomponent call render function from constructor?
  // <MyComponent v-model="data" />
  // <MyComponent :text="hello!" />
  // <MyComponent>Slot content??</MyComponent>
  // compile - need to get access to the #app div and go from there.
  // actually render() might be called here and will propagate down from there.
  // also needs an element to bind to, and a component to act as top-level.
  // constructor is also where options and plugins are passed.
}

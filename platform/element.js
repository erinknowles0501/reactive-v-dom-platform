export default class Element {
  constructor(text) {
    this.rawText = text;
    this.text = "";
    this.props = {};
    this.parseText();
  }

  // vdom gives us the attrs, text, tag, children...
  // props shows us what needs to be updated

  parseText() {
    // parses {{ }} template and then passes it directly
    // to a (tag, basically) function which then is re-run when those vars update.

    const strings = this.rawText.split(/{{.*?}}/gim); // my very first homebrew regex...!
    const propNames = this.rawText
      .match(/{{.*?}}/gim)
      .map((item) => item.replace(/{{|}}/gim, "").trim()); // very second!!

    console.log("elements strings propNames", strings, propNames);

    this.strings = strings;
    this.propNames = propNames;
  }

  updatePropValue(key, value) {
    // Only ever called in a forEach so it's only ever one prop

    this.props[key] = value;

    this.generateText();
  }

  generateText() {
    // this.text = ...
    // will need strings and propnames here
    console.log(`Me am text`, this.props);
    //this.strings.forEach((str) => {});
  }
}

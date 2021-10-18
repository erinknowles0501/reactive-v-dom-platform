export default class PlatformElement {
  constructor(domInfo) {
    this.innerTemplate = "";

    ({
      text: this.rawText, // text should always be the correct text - passed to it from component which does the parsing
      tag: this.tag,
      attrs: this.attrs,
      children: this.children,
    } = domInfo);

    if (!this.children.length && this.rawText) {
      // TODO: Right now, there are some components that have no children and no text which breaks stuff.

      // this.text = this.parseText(this.rawRext); // Move this parsing to templateParser...
      this.text = this.rawText; // TODO parse + reactivity
    }

    this.props = {};
    this.propNames = []; // better way to do this? Store in props without value?
  }

  updatePropValue(key, value) {
    // Only ever called in a forEach so it's only ever one prop
    this.props[key] = value;
    this.generateText();
  }

  parseText() {
    // parses {{ }} template and then passes it directly
    // to a (tag, basically) function which then is re-run when those vars update.

    console.log("this rawtext", this.rawText);

    this.strings = this.rawText
      .replace("\n", "")
      .replace("  ", "")
      .split(/{{.*?}}/gi); // my very first homebrew regex...!

    let hasProps = this.rawText.match(/{{.*?}}/gi);
    if (!!hasProps) {
      this.propnames = hasProps.map((item) =>
        item.replace(/{{|}}/gi, "").trim()
      );
    }

    // TODO: This part
    this.text = this.strings.join(" ");
  }

  generateText() {
    // this.text = ...
    // will need strings and propnames here
    console.log(`Me am text`, this.props);
    //this.strings.forEach((str) => {});
  }

  render() {
    // Gets a (nested) list of elements that know their tag, text, props, etc.
    // Turns them into DOM elements.
    // TODO: Dev errors all through here, so many things to go wrong
    // TODO for attrs props events and so forth

    const renderedElement = document.createElement(this.tag);

    if (!this.children.length) {
      renderedElement.innerText = this.text; // TODO: deal with this
    } else {
      // If it has children, append their rendering to this one - the render chain.
      this.children.forEach((child) => {
        const platformElement = new PlatformElement(child);
        renderedElement.appendChild(platformElement.render());
      });
    }

    console.log("rendered element", renderedElement);

    return renderedElement;
  }
}

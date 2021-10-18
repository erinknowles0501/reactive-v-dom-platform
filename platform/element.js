export default class PlatformElement {
  constructor(domInfo) {
    this.innerTemplate = "";

    ({
      text: this.text, // text should always be the correct text - passed to it from component which does the parsing
      tag: this.tag,
      attrs: this.attrs,
      children: this.children,
    } = domInfo);

    this.props = {};
    this.propNames = []; // better way to do this? Store in props without value?
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

export default class PlatformElement {
  constructor(domInfo) {
    this.rawText = ""; // Need this to grab from component to re-parse.

    ({
      text: this.text, // text should always be the correct text - passed to it from component which does the parsing
      tag: this.tag,
      attrs: this.attrs,
      children: this.children,
      id: this.id,
    } = domInfo);

    this.renderedElement = null;
  }

  render() {
    // Starts with itself, and creates DOM elements all the way down from
    // the domInfo of each Element.
    // TODO: Dev errors all through here, so many things to go wrong
    // TODO for attrs props events and so forth

    console.log("%c START RENDER: ", "color: red; font-size: 16px", this.tag);

    const renderedElement = document.createElement(this.tag);
    renderedElement.id = this.id;
    renderedElement.attrs = this.attrs;

    if (!this.children.length) {
      renderedElement.innerText = this.text;
    } else {
      console.log("render: has children");
      // If it has children, append their rendering to this one - the render chain.
      this.children.forEach((childInfo) => {
        const platformElement = new PlatformElement(childInfo);
        console.log("render: platformElement", platformElement);
        renderedElement.appendChild(platformElement.render());
      });
    }

    console.log("%c END RENDER ", "color: red; font-size: 16px", this.tag);

    this.renderedElement = renderedElement;
    console.log("rednered element: ", this.renderedElement);
    return renderedElement;
  }
}

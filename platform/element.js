export default class PlatformElement {
  constructor(domInfo) {
    this.innerTemplate = "";

    ({
      text: this.rawText,
      tag: this.tag,
      attrs: this.attrs,
      children: this.children,
    } = domInfo);
    this.text = ""; // Move this parsing to templateParser...

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

    const renderedElement = document.createElement(this.tag);

    if (!this.children.length) {
      renderedElement.innerText = this.text ?? this.rawText; // TODO: deal with this
      console.log("has no chillens, this is text: ", this.text ?? this.rawText);
    } else {
      // If it has children, append their rendering to this one - the render chain.
      this.children.forEach((child) => {
        console.log("child template in el render", child);
        child.text = child.rawText ?? child.text;

        const platformElement = new PlatformElement(child);
        renderedElement.appendChild(platformElement.render());
      });
    }

    return renderedElement;
  }
}

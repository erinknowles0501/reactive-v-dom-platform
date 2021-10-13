export default class PlatformElement {
  constructor(rawTemplate) {
    this.rawTemplate = rawTemplate; // must be only one tag.
    this.innerTemplate = "";
    this.domInfo = {
      text: "",
      tag: "",
      attrs: null,
      children: null,
    };
    this.rawText = "";
    this.props = {};
    this.propNames = []; // better way to do this? Store in props without value?
    this.parseTemplate();
    //this.parseText();
  }

  // vdom gives us the attrs, text, tag, children...
  // props shows us what needs to be updated

  parseTemplate() {
    // Will need to rearrange strucutre a bit for cascading parsing, but for now:
    // Identify main tag, set it to this element's this.tag.
    // Identify any attrs for the main tag.
    // Identify what's within. Could be any combo of these:
    //   - Simple text strings (I'm cheating and not sending any of these. Everything's in a tag)
    //   - Components
    //   - Elements
    // Once identified, make a new Component and a new Element (for example), and pass their
    // part of the raw template to them, then call their parseTemplate, which will return
    // their parsed template (and the parsed template of anything below) to be sent all the way up
    // the parse chain.

    const parser = new DOMParser();
    console.log("raw template: ", this.rawTemplate);
    const HTMLElement = parser.parseFromString(this.rawTemplate, "text/html")
      .body.children[0]; // We know this is an element and we know there's only one.

    this.domInfo.tag = HTMLElement.tagName;
    this.domInfo.attrs = HTMLElement.attributes;
    this.innerTemplate = HTMLElement.innerHTML;

    // Because I'm cheating for now and wrapping all text in a tag,
    // if the innerTemplate has any children, then this is a container node and doesn't contain any text,
    // and the parse chain should continue through them.
    const HTMLInnerTemplate = parser.parseFromString(
      this.innerTemplate,
      "text/html"
    ).body;
    if (!!HTMLInnerTemplate.children) {
      // TODO: Figure out how Components are handled here..
      Array.from(HTMLInnerTemplate.children).forEach((child) => {
        const childRawTemplate = child.outerHTML;
        console.log("childRawTemplate", childRawTemplate);
        const platformChild = new PlatformElement(childRawTemplate);
        console.log("calling parse chain!");
        platformChild.parseTemplate(child.innerHTML);
      });
    }
    // If it doesn't have children, then it contains just text (maybe with props) and I need to call parseText().

    // Remove any tags and anything between tags - we want just the text.
    //this.rawText = this.innerTemplate.replace(/<.*?>/gi, "").replace("  ", "");

    // Here's the parse chain
    //this.children = this.innerTemplate.match();

    this.parseText();

    console.log("parsed", this);
  }

  parseText() {
    // parses {{ }} template and then passes it directly
    // to a (tag, basically) function which then is re-run when those vars update.

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

    //...
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

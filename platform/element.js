export default class PlatformElement {
  constructor(rawTemplate = null) {
    // Either passed a raw template to parse,
    // or its dominfo is already set.
    this.rawTemplate = rawTemplate;
    this.innerTemplate = "";
    this.domInfo = {
      text: "",
      tag: "",
      attrs: null,
      children: [],
      parent: null,
    };
    this.domElement = null;
    this.rawText = "";
    this.props = {};
    this.propNames = []; // better way to do this? Store in props without value?
  }

  updatePropValue(key, value) {
    // Only ever called in a forEach so it's only ever one prop
    this.props[key] = value;
    this.generateText();
  }

  parseTemplate() {
    // Will need to rearrange strucutre a bit for cascading parsing, but for now:
    // Identify main tag, set it to this element's this.tag.
    // Identify any attrs for the main tag.
    // Identify what's within. Could be any combo of these:
    //   - Simple text strings (I'm cheating and not sending any of these. Everything's in a tag)
    //   - Components
    //   - Elements
    // Once identified, make a new Element (for example), and pass their
    // part of the raw template to them, then call their parseTemplate, which will return
    // their parsed template (and the parsed template of anything below) to be sent all the way up
    // the parse chain.

    // TODO UPDATE: Parse chain will need parents - to stick to.
    const parser = new DOMParser();
    const HTMLElement = parser.parseFromString(this.rawTemplate, "text/html")
      .body.children[0]; // We know this is an element and we know there's only one.

    this.domInfo.tag = HTMLElement.tagName;
    this.domInfo.attrs = HTMLElement.attributes;
    this.innerTemplate = HTMLElement.innerHTML;

    // Because I'm cheating for now and wrapping all text in a tag,
    // if the innerTemplate has any children, then this is a container node and doesn't contain any text,
    // and the parse chain should continue through them.
    // TODO: Don't have to re-parse this part.
    const HTMLInnerTemplate = parser.parseFromString(
      this.innerTemplate,
      "text/html"
    ).body;

    let children = [];

    if (!!HTMLInnerTemplate.children.length) {
      // TODO: Figure out how Components are handled here..
      console.log("has chills");
      Array.from(HTMLInnerTemplate.children).forEach((child) => {
        const childRawTemplate = child.outerHTML;
        const platformChild = new PlatformElement(childRawTemplate);
        children.push(platformChild.parseTemplate(child.innerHTML));
      });
      this.domInfo.children = JSON.parse(JSON.stringify(children)); // TODO: Did this for safety, look into if needed.
    } else {
      // If it doesn't have children, then it contains just text (maybe with props) and I need to call parseText().
      console.log("no chillens");
      this.rawText = HTMLInnerTemplate.innerText;
      this.parseText();
    }

    // Remove any tags and anything between tags - we want just the text.
    //this.rawText = this.innerTemplate.replace(/<.*?>/gi, "").replace("  ", "");

    console.log("this dominfo", this.domInfo);
    return this.domInfo;
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
    this.domInfo.text = this.strings.join(" ");
  }

  generateText() {
    // this.text = ...
    // will need strings and propnames here
    console.log(`Me am text`, this.props);
    //this.strings.forEach((str) => {});
  }

  render() {
    // Gets a (nested) list of elements that know their tag, text, props, etc. ** AND PARENT
    // Turns them into DOM elements.

    const renderedElement = document.createElement(this.domInfo.tag);

    console.log("parsetemplate in render element", this.parseTemplate());

    this.parseTemplate().children.forEach((el) => {
      console.log("el in el render", el);
      if (el.text) {
        console.log("el has text");
        // Since I'm cheating for now, elements with text do not contain any other elements.
        renderedElement.innerText = el.text;
      } else {
        console.log("el doesnt have text");

        const platformElement = new PlatformElement();
        platformElement.domInfo = el;
        console.log("plat el", platformElement);
        renderedElement.appendChild(platformElement.render());
      }
    });

    return renderedElement;
  }
}

/**
 * TemplateParser service - is passed a template, and instead of starting a parse chain,
 * it's just recursive. Also parses text into tag-function-able strs and vars....will need
 * to figure out how this will work with the element/component. Returns nested array of
 * PlatformElements to be rendered.
 * */

import PlatformElement from "../element.js";

export default class TemplateParser {
  static parseTemplate(template) {
    // Recursive. Is passed a template, generates a PlatformElement from the top-level
    // item, adds that to the parsedElements array, then sends the inner items - the rest of the template -
    // back to this function.

    // The domInfo that will end up being passed to the PlatformElement that's returned from this iteration of the function.
    const domInfo = {
      tag: "",
      attrs: null,
      children: [],
      text: "",
    };

    const parser = new DOMParser();
    const HTMLElement = parser.parseFromString(template, "text/html").body
      .children[0];

    domInfo.tag = HTMLElement.tagName;
    domInfo.attrs = HTMLElement.attributes; // TODO: maybe map these for easier access
    const innerTemplate = HTMLElement.innerHTML;

    // Because I'm cheating for now and wrapping all text in a tag,
    // if the innerTemplate has any children, then this is a container node

    // TODO: Don't have to re-parse this part.
    const HTMLInnerTemplate = parser.parseFromString(
      innerTemplate,
      "text/html"
    ).body;

    let children = [];

    if (!!HTMLInnerTemplate.children.length) {
      // TODO: Figure out how Components are handled here..
      console.log("has chills");
      console.log(HTMLInnerTemplate.children);
      Array.from(HTMLInnerTemplate.children).forEach((child) => {
        const platformChild = new PlatformElement(
          this.parseTemplate(child.outerHTML)
        );
        children.push(platformChild);
      });
      //domInfo.children = JSON.parse(JSON.stringify(children)); // TODO: Did this for safety and to keep moving, look into if needed.
    } else {
      // If it doesn't have children, then it contains just text (maybe with props) and I need to call parseText().
      console.log("no chillens");
      domInfo.text = HTMLInnerTemplate.textContent;
    }
    domInfo.children = children;
    // Remove any tags and anything between tags - we want just the text.
    //this.rawText = this.innerTemplate.replace(/<.*?>/gi, "").replace("  ", "");

    console.log("dominfo", domInfo);
    return domInfo;
  }
}

import Component from "../../platform/component.js"; // make global

const Item = new Component({
  name: "Item",
  data: { greeting: "HELLO" },
  props: ["text"],
  template: `
    <div style="background: grey">
      <p>{{ text }}
    </div>
  `,
});

export default Item;

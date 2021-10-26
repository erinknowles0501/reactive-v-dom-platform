import Component from "../../platform/component.js"; // make global

const Item = new Component({
  name: "Item",
  data: { greeting: "HELLO" },
  props: ["text"],
  template: `
    <div style="background: skyblue">
      <p>{{ text }} ALSO HI I'M AN ITEM</p>
    </div>
  `,
});

export default Item;

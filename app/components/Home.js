import Component from "../../platform/component.js"; // make global
import Item from "./Item.js";

const Home = new Component({
  name: "Home",
  data: {
    greeting: "HELLO",
    items: ["Take dog out", "Do laundry", "Finish dishes"],
  },
  template: `
    <div style="background: yellow">
      <h1>Home</h1>
      <p>{{ greeting }}! I am here!!</p>
      <button onclick="this.reactive.greeting = 'neeee'">Neeee</button>
      <!-- <Item p-for="item in items" :text="item" /> -->
    </div>
  `,
});

export default Home;

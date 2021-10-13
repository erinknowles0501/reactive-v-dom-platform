import Component from "../../platform/component.js";

const Home = new Component({
  data: { greeting: "HELLO" },
  template: `
  <div style="background: yellow">{{ greeting }}! I am here!!</div>
  `,
});

export default Home;

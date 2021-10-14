import Component from "../../platform/component.js";

const Home = new Component({
  data: { greeting: "HELLO" },
  template: `
  <div style="background: yellow">
    <h1>Home</h1>
    <p>{{ greeting }}! I am here!!</p>
    <div>
      <p>Haha</p>
    </div>
  </div>
  `,
});

export default Home;

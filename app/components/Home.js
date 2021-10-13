import Component from "../../platform/component.js";

const Home = new Component({
  data: { greeting: "HELLO" },
  template: `
  <div style="background: yellow">
    <h1>Home</h1>
    <p>{{ greeting }}! I am here!!</p>
  </div>
  `,
});

export default Home;

/**
 * Virtual DOM of an example template:
 * {
 *   Element (div, style...) {
 *     Element (text) {},
 *     Element (text, props) {
 *       Component (...) {
 *         Element (text)
 *       }
 *     }
 *   }
 * }
 * In retrospect should be an array?
 * */

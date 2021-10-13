import Platform from "../platform/index.js";
import Home from "./components/Home.js";

function showMe(objVar, cloneValue = false) {
  const [varName, value] = Object.entries(objVar)[0];

  console.log(`${varName}: `, cloneValue ? deepClone(value) : value);
} // Development helper

function deepClone(val) {
  return JSON.parse(JSON.stringify(val));
} // with the exception of lodash's implementation, this is the easiest and lightest way to deep clone an object.

const app = new Platform("#app", Home);

/** various ways to make DX of defining a component...
 *  Could have:
 *  const mainPage = new Component();
 *  mainPage.define({name, components, props, ...});
 *  mainPage.details({data, computed, methods })
 *  mainPage.template(`<h1>Hello!</h1>`)
 *  orr...
 *  new Component(), mainPage.describe( [everything] );
 *
 * */

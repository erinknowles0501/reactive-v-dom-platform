import Platform from "../platform/index.js";
import Home from "./components/Home.js";

function showMe(objVar, cloneValue = false) {
  const [varName, value] = Object.entries(objVar)[0];

  console.log(`${varName}: `, cloneValue ? deepClone(value) : value);
} // Development helper

function deepClone(val) {
  return JSON.parse(JSON.stringify(val));
} // with the exception of lodash's implementation, this is the easiest, lightest, and foolest-proof way to deep clone an object.

/*
 *  Here it is!
 */
const app = new Platform("#app", Home);

const reactivityButton = document.createElement("button");
reactivityButton.textContent = "Clickme";
reactivityButton.onclick = function () {
  Home.reactive.greeting = "Meee";
  console.log("Home after button:", Home);
};

const appElement = document.getElementById("app");
appElement.appendChild(reactivityButton);

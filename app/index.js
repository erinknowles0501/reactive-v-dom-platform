import Platform from "../platform/index.js";
import Home from "./components/Home.js";

/*
 *  Here it is!
 */
const app = new Platform("#app", Home);

const reactivityButton = document.createElement("button");
reactivityButton.textContent = "Clickme";
reactivityButton.onclick = function () {
  Home.data.greeting = "Meee";
  console.log("Home after button:", Home);
};

const appElement = document.getElementById("app");
appElement.appendChild(reactivityButton);

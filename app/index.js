import Platform from "../platform/index.js";
import Component from "../platform/component.js";

const app = new Platform();

const mainPage = new Component();

/** Create a basic to-do app. Classic!
 *   - Input field for new task. Enter adds the task.
 *   - tasks list is reactive and iterated
 *   - Task component is passed :checked
 *   - checkedItems data item - array of task ids
 *      - id generated by date.now * math.random - not perfect but okay for until we get npm's uuid in here
 *
 *
 * */

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
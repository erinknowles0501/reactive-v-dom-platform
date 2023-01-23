# Reactive v-dom platform

_Goal: Build a Vue-like platform in vanilla JS that can be used to build a basic To-do app, focusing on not 'just doing it like Vue does' or by following a tutorial: instead, figuring out and implementing reactivity and efficient rendering in the way that makes sense to me, with points for novelty._

The developer api is very similar to Vue - you'll recognize the data object, the `{{ }}` templating, `p-for` instead of `v-for`, etc.

## Folder structure

`/platform` contains the platform code. `/app` contains an app built using that platform.

`index.html` is the actual served page - it contains the `#app` element that the platform is passed to bind to.

## How it works / where it's headed right now

Each Component, in its constructor, calls `generateReactiveData`, which iterates over its data + any props and changes them to getters/setters, and generates Reactables for each of them. Reactables are saved to the component in this.reactables.

A Reactable is a class that saves functions that should be run when a certain data item updates, and can run those functions. These functions are created by parsing the elements of a Component, determining which of them are 'dynamic' - ie, might react to state change - and figuring out HOW these elements are dynamic - ie, a `p-if` means it's conditionally displayed, vs a `{{ value }}` means that part of its textContent might change. The functions are then generated accordingly, to specifically update that element in a specific way when the Reactable calls its `update()` function. This function generation will prevent re-rendering child elements.

Each Component has a `parseAndRender()` method which parses its template (the HTML-like portion with platform-specific additions) to DOM Elements, appends any children to the top element, and returns the top element. When it hits a Component, it gets that component from `this.components` and calls `parseAndRender()` on that recursively, and then appends those elements in order. The Platform calls `parseAndRender()` on the top Component it's passed and the rest generates from there.

## Self notes

In January 2023 I was working on something else and ended up partially implementing a homerolled framework - funny how much work I'll go to to save myself work! I ended up pulling it out, but that work is relevant for this project. The repo is fridge-poetry and the commit is 5f0a0338d841a7bfe9661a8df89ec78bb93727c1. Link to diff (hint to future self - check out the deleted files - userDropdown for example, and the UI registration in ./index.js): https://github.com/erinknowles0501/fridge-poetry/commit/5f0a0338d841a7bfe9661a8df89ec78bb93727c1

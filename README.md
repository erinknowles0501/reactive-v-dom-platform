# Quick notes

I imagine it's something like, a Vue component is a JS class where each data item is iterated and set as a static with a get() and set()er, and each DOM element-to-be is stored like, idk,
class DOMElement {
constructor(props) {
this.dataDependencies = {...props}
}

Vue:

```
name: string lookup for a component?
components: let compiler know it needs these components to work?
props: reactive items (should directly reference the parent's prop?)
data: function so you always get latest when you reference it
computed:
methods:
watch:

created()
mounted()
beforeUnmount()
destroy()
...I guess lifestyle hooks run in order.



```

Should probably look into generators.

Need to write diff....

Look into Svelte's anti-virtual-dom thing
( it not having a virtual DOM, and instead compiling vanilla methods to specifically change just the reactive elements based on a setter...?)

Sample virtual dom (after toObject..)
UPDATE: Use tag functions for text...somehow

```
{
  tag: "div",
  text: "",
  children: [
    {
      tag: "h1",
      text: "Hello",
    },
    {
      tag: "p",
      text: ["This is a ", " description"],
      children: [
        {
          tag: "i",
          text: "very good",
        },
      ],
    },
    {
      tag: "p",
      text: ["And this is ", " description, of ", " quality"],
      children: [
        {
          tag: "i",
          text: "another",
        },
        {
          tag: "a",
          text: "exceptional",
          attrs: { href: "http://google.ca" },
        },
      ],
    },
  ],
}
```

## Devlog:

### #1

I decided to build this platform to the point that it could be used to build a simple ToDo app, since that's a fairly classic first app. I started by writing a simple Vue ToDo app, so I could see the essential functionality I had to implement: https://codepen.io/erinknowles/pen/oNevBwx

- Props passed down to components with binding
- $emit (with passing a value along)
- ^ the two above come together to make v-model
- v-modelling actual html element, not needed for vue component
- html attrs
- v-for (item and index, array only)
- :key. Will have to think about how to v-for and key.
- reactive data
- methods
- conditionally applying a css style
- Platform needs to 'mount' somehow.

I also knew I wanted to include useful error reporting for development.

### #2

Some conceptualizing is having to happen during development as I realize things about the project. Ideally I would have whiteboarded and walked through the whole thing with a colleague or two first. As it was my own whiteboarding missed some stuff.

I am learning Regex by necessity.

Reactivity is working in theory.

Have solidified concept of parse chain and render chain.

### #3

Am becoming more familiar with the JS DOM api. Am seeking out a thorough overview tutorial or similar to familiarize myself with what's possible, in case it's useful later.

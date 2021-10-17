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

What I ended up needing to implement:

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

### #4

Had a hiccup - got through it by realizing I don't have to be tied to anything I've already done. I realized that the PlatformElement structure isn't quite right - there's the PlatformElement that has its dominfo and renders itself, and there's another class (service) that GETS THAT DOMINFO IF IT DOESN'T EXIST. Having them both in the same class meant that the parse/render chains were funkin up, and I realized that instead of re-writing the class so both implementations would work, I should separate the parsing into a service.

### #5

TemplateParser service - is passed a template, and instead of starting a parse chain, it's just recursive. Also parses text into tag-function-able strs and vars....will need to figure out how this will work with the element/component. Returns nested array of PlatformElements to be rendered.

### #6

Have theory on why Vue (and React, originally) only allowed component templates with exactly one top-level tag - because, in my implementation at least, render() is called on the element (because it knows its dom info) and having one component have multiple top-level elements is possible but hard to coordinate......? Look into how hard this even is.

### #7

Something's not right with the renderer....I'm noticing that console logs are showing up more than they should (not in the parser, just the rendered), ie it looks like elements are being rendered at least twice. On the DOM it ends up only being once, which is good, but I think the problem is something like, if an element has two children, both of those children call render - HMM NO it IS in the parser. Somehow elements are ending up with themselves as their children if they have none already - fixed.

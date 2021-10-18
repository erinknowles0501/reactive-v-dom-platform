# Quick notes

## First thoughts:

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

### #8

Feeling like another realization-hiccup is coming, something about how to get components to connect to their elements. Could have parseTemplate, when it encounters a component, create that component and NO. No fine, import that component (need to search through the appropriate folder for the class - maybe export \* from a file in there.) and set that component's element in parse.
...components need to be defined with a name that matches their import name (and path??)
No this is not working - components often have nested elements way down that have reactive elements - not every reactive piece of text (for eg) is going to be the direct child of a component.
What was wrong with the parse chain? It was that the parsing was happening in the element...could I bring it back but the parsing happens in the component (this makes sense) and the next parsing is handed down to the next component...and the component has an array of elements....and the render chain is unaffected, it just goes through the arrays one by one and onto the next without ever knowing its going through components.
COuld also do this in the current way - set the components element and all its children until the next component to the component's element. And then component can parse all the text in everything beneath it until the next component.
Making new branch for parse chain approach.

### #8.5

Hehe here I am in the branch!
Bringing back the parse chain has worked so far, need to take it a little further (basic reactivity) to see if it's worth pursuing...
So....how tell an element to update when its prop changes. We need a list of elements keyed to the props the component manages. How do we get that. Pass the element to the parser? How do we pass it before parsing..? I guess we could define the element BEFORE and then add all its dom info to it.
Elements need ids.
Can't set topelement in a parsechain unless we know it's the top element :) Besides the component needs an array of either the elements or their ids (would maybe prefer the ids, then we can get the rendered version).
Actually speak of which should elements save their rendered part?

### #8.6

Okay do we even need PlatformElements....they don't do anything but render themselves, but that could be easily restructured - topElement calls render on its parseChain...
The benefit though is a PlatformElement, when it renders itself, saves its DOMElement! Making selecting that element and updating it very easy...
There's something else - keep the PlatformElements and keep them rendering themselves, but change the parseChain to be THOSE ELEMENTS, not just their domInfo. The benefit is we can just directly platformElement.element.innerText = updatedText, instead of querying the document.
That said querying the document seems foolproof enough - if we update the elements array with the item itself instead of its id whenever we access it, we're cacheing that effort too.

### #8.7

Update: the children array needs to be the PlatformElements - because those store their rawText.
We COULD just store the id and its rawText together...would that work for other types of reactivity?

- Whether to have a class
- Whether to display at all
- Whether to have an attr
- How many elements beneath it to render (v-for)....

Altogether sounds like we do need the PlatformElement. Come back to this.

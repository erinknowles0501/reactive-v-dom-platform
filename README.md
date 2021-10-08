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

## Process:

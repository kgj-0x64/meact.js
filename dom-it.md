# DOM

## Node vs Element

DOM nodes are regular JavaScript objects. We can alter them.

In the context of the Document Object Model (DOM), **DOM nodes** and **DOM elements** are closely related but distinct concepts.

- For instance, `DocumentFragment` is a DOM node (i.e. a DOM object) but not a DOM element (i.e. not a node in the rendered tree).

### 1. **DOM Node**

**Definition**: A DOM node is a generic term that refers to any object in the DOM tree. The DOM represents an HTML or XML document as a tree structure, where each object in the tree is considered a node.

- **Types of Nodes**: There are several types of nodes, including:

  - **Element nodes**: Represent elements in the HTML or XML (e.g., `<div>`, `<p>`, `<span>`).
  - **Text nodes**: Represent the text content inside an element.
  - **Attribute nodes**: Represent attributes of elements (e.g., `id="header"`).
  - **Comment nodes**: Represent comments in the HTML or XML document.
  - **Document nodes**: Represent the entire document.

- **Example**: If you have a paragraph in your HTML like `<p>Hello, world!</p>`, the paragraph itself is an element node, while "Hello, world!" is a text node within that element node.

### 2. **DOM Element**

**Definition**: A DOM element is a specific type of DOM node that represents an HTML or XML element. Elements are a subset of nodes.

- **Characteristics**:

  - DOM elements specifically refer to HTML or XML tags (like `<div>`, `<p>`, `<a>`, etc.).
  - They can have attributes, children (other nodes), and content.
  - DOM elements can be manipulated using JavaScript (e.g., changing attributes, adding/removing children).

- **Example**: In the HTML `<div id="container"><p>Hello!</p></div>`, the `<div>` and `<p>` tags are DOM elements.

In summary, **DOM nodes** include everything in the DOM tree (elements, text, attributes, comments, etc.), whereas **DOM elements** refer specifically to the HTML or XML tags (like `<div>`, `<p>`, etc.).

## Attribute vs Property

[When writing HTML source code, you can define attributes on your HTML elements. Then, once the browser parses your code, a corresponding DOM node will be created. This node is an object, and therefore it has properties.](https://stackoverflow.com/a/6004028/3083243)

For a given DOM node object, "properties" are the properties of that object, and "attributes" are the array elements of the attributes property of that object.

> Attributes are defined by HTML. Properties are defined by the DOM (Document Object Model).
>
> When the browser parses the HTML to create DOM objects for tags, it recognizes standard attributes and creates DOM properties from them.
>
> - Quite rarely, even if a DOM property type is a string, it may differ from the attribute. For instance, the href DOM property is always a full URL, even if the attribute contains a relative URL or just a `#hash`.

### Property

DOM properties and methods behave just like those of regular JavaScript objects:

1. They are case-sensitive.
2. They can have any value. For instance, the `input.checked` property for checkboxes is a `boolean`.

[Properties come with validation and defaults, whereas attributes don't.](https://jakearchibald.com/2024/attributes-vs-properties/)

- For instance, `value` property of `select` element can only be set to one of the values from its children `option` elements.

### Attribute

HTML attributes have the following features:

1. Their name is case-insensitive (`id` is same as `ID`).
2. Their values are always strings so as to work in the serialised HTML format. For instance, the style attribute is a string, but the style property is an object

#### Custom Attribute

To avoid conflicts with standard attributes, there exist `data-*` attributes. All attributes starting with "data-" are reserved for programmers' use. They are available in the dataset property.

- For instance, if an `elem` has an attribute named "data-about", it’s available as `elem.dataset.about`.

### [Property-Attribute Synchronization](https://javascript.info/dom-attributes-and-properties)

When a DOM node is created for a given HTML element, many of its properties relate to attributes with the same or similar names, but it's not a one-to-one relationship. For instance, for this HTML element: `<input id="the-input" type="text" value="Name:">`, the corresponding DOM node will have `id`,`type`, and `value` properties (among others):

- The `id` property is a _reflected property_ for the `id` attribute: Getting the property reads the attribute value, and setting the property writes the attribute value. `id` is a _pure_ reflected property, it doesn't modify or limit the value.

  - [When a property reflects an attribute, the attribute is the source of the data. When you set the property, it's updating the attribute. When you read from the property, it's reading the attribute.](https://jakearchibald.com/2024/attributes-vs-properties/)

- The `type` property is a _reflected property_ for the `type` attribute: Getting the property reads the attribute value, and setting the property writes the attribute value. `type` isn't a pure reflected property because it's limited to _known values_ (e.g., the valid types of an input). If you had `<input type="foo">`, then `theInput.getAttribute("type")` gives you `"foo"` but `theInput.type` gives you `"text"`.

- In contrast, the `value` property doesn't reflect the `value` attribute. Instead, it's the _current value_ of the input. When the user manually changes the value of the input box, the `value` property will reflect this change. The `value` property reflects the **current** text-content inside the input box, whereas the `value` attribute contains the **initial** text-content of the `value` attribute from the HTML source code. So if you want to know what's currently inside the text-box, read the property. If you, however, want to know what the initial value of the text-box was, read the attribute. Or you can use the `defaultValue` property, which is a pure reflection of the `value` attribute.

There are several properties that directly reflect their attribute (`rel`, `id`), some are direct reflections with slightly-different names (`htmlFor` reflects the `for` attribute, `className` reflects the `class` attribute), many that reflect their attribute but with restrictions/modifications (`src`, `href`, `disabled`, `multiple`), and so on. [The spec](https://www.w3.org/TR/html5/infrastructure.html#reflect) covers the various kinds of reflection.

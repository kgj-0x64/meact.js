# Why should we make Single Entrypoint of the Library?

Apart from size increase due to redundancy...

## Issue

If two different bundles of "meact" library are being created via "meact-csr/client.js" and "home.js" (home page) entry points, then it will cause issues in comparing reference variables and prototype chains.

> If there are multiple copies of the `MeactElement` class (e.g., from different modules, different bundles, or different contexts), the `instanceof` check may fail. Each copy of the `MeactElement` class will have a different `prototype` object, and `instanceof` checks if the object’s prototype chain includes the exact `prototype` object of the constructor.
>
> - Example Scenario: If `MeactElement` is imported from two different versions or modules, the `instanceof` check would fail because the `returnedElement` is not an instance of the specific `MeactElement` class you’re checking against.

### Error Message

```text
returnedElement instanceof MeactElement true ReactHtmlElement MeactElement {id: 'div-36', type: 'ReactHtmlElement', name: 'div', props: {…}, propChildrenSnapshot: undefined, …}

home.js:811 returnedElement instanceof MeactElement true ReactHtmlElement MeactElement {id: 'div-37', type: 'ReactHtmlElement', name: 'div', props: {…}, propChildrenSnapshot: undefined, …}

client.js:791 returnedElement instanceof MeactElement false ReactHtmlElement MeactElement {id: 'div-38', type: 'ReactHtmlElement', name: 'div', props: {…}, propChildrenSnapshot: undefined, …}

client.js:879 An error occurred in loading or executing app script: Error: A component must return only one and a valid child element
at createElement2 (client.js:798:15)
at jsx (client.js:838:12)
at MyApp (client.js:862:76)
at createElement2 (client.js:790:31)
at jsx (client.js:838:12)
at hydration (client.js:870:48)
at run (client.js:877:7)
at home:31:34
```

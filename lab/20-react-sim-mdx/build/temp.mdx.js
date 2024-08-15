/*@jsxRuntime automatic*/
/*@jsxImportSource meact*/
/*A comment!*/
import { GreetingApp } from "@src/components.jsx";
export const Local = (props) => (
  <span
    style={{
      color: "red",
    }}
    {...props}
  />
);
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    hr: "hr",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...props.components,
  };
  return (
    <>
      <_components.h1>{"Heading (rank 1)"}</_components.h1>
      {"\n"}
      {}
      {"\n"}
      {"\n"}
      <_components.p>{"An external component:"}</_components.p>
      {"\n"}
      <GreetingApp />
      {"\n"}
      <_components.p>
        {"and a "}
        <Local>{"local one"}</Local>
        {"."}
      </_components.p>
      {"\n"}
      <_components.h2>{"Heading 2"}</_components.h2>
      {"\n"}
      <_components.h3>{"3"}</_components.h3>
      {"\n"}
      <_components.h4>{"4"}</_components.h4>
      {"\n"}
      <_components.h5>{"5"}</_components.h5>
      {"\n"}
      <_components.h6>{"6"}</_components.h6>
      {"\n"}
      <div class="note">
        <_components.blockquote>
          {"\n"}
          <_components.p>
            {"And here is "}
            <_components.em>{"markdown"}</_components.em>
            {" in "}
            <_components.strong>{"JSX"}</_components.strong>
            {"!"}
          </_components.p>
          {"\n"}
        </_components.blockquote>
      </div>
      {"\n"}
      <_components.p>
        <abbr title="HyperText Markup Language">{"HTML"}</abbr>
        {" is a lovely language."}
      </_components.p>
      {"\n"}
      <section>
        {"Two 🍰 is: "}
        {Math.PI * 2}
      </section>
      {"\n"}
      <_components.ul>
        {"\n"}
        <_components.li>{"Unordered"}</_components.li>
        {"\n"}
        <_components.li>{"List"}</_components.li>
        {"\n"}
      </_components.ul>
      {"\n"}
      <_components.ol>
        {"\n"}
        <_components.li>{"Ordered"}</_components.li>
        {"\n"}
        <_components.li>{"List"}</_components.li>
        {"\n"}
      </_components.ol>
      {"\n"}
      <_components.p>
        {"A paragraph, introducing a thematic break:"}
      </_components.p>
      {"\n"}
      <_components.hr />
      {"\n"}
      <_components.pre>
        <_components.code className="language-js">
          {"some.code();\n"}
        </_components.code>
      </_components.pre>
      {"\n"}
      <_components.p>
        {"a "}
        <_components.a href="https://example.com">{"link"}</_components.a>
        {", an "}
        <_components.img src="./image.png" alt="image" />
        {", some "}
        <_components.em>{"emphasis"}</_components.em>
        {",\r\nsomething "}
        <_components.strong>{"strong"}</_components.strong>
        {", and finally a little "}
        <_components.code>{"code()"}</_components.code>
        {"."}
      </_components.p>
    </>
  );
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  );
}

const Layout = ({ children }) => (
  <div>
    <nav>
      <a href="/page1">Page 1</a> | <a href="/page2">Page 2</a>
    </nav>
    <main>{children}</main>
  </div>
);

export default Layout;

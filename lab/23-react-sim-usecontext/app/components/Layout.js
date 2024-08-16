export function Layout({ children }) {
  return (
    <div>
      <nav>
        <a href="/home">Home</a> | <a href="/about">About</a>
      </nav>
      <main>{...children}</main>
    </div>
  );
}

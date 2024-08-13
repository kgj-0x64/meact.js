import { Layout } from "./components/Layout.js";

function MyApp({ Page, pageProps }) {
  return (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  );
}

export default MyApp;

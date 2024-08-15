import { Layout } from "./components/index.js";

function MyApp({ Page, pageProps }) {
  return (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  );
}

export default MyApp;

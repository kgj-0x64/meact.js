import { Layout } from "./components/index.js";

function MyApp({ PageComponentFn, pageProps }) {
  return (
    <Layout>
      <PageComponentFn {...pageProps} />
    </Layout>
  );
}

export default MyApp;

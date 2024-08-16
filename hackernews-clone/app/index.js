function MyApp({ PageComponentFn, pageProps }) {
  return <PageComponentFn {...pageProps} />;
}

export default MyApp;

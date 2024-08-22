interface IMyAppProps {
  PageComponentFn: Function;
  pageProps: Record<string, any>;
}

function MyApp(props: IMyAppProps) {
  const { PageComponentFn, pageProps } = props;

  return <PageComponentFn {...pageProps} />;
}

export default MyApp;

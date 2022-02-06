import App from "next/app";
import "./globals.css";

import Layout from "components/Layout";

export default class MyApp extends App {
  componentDidMount(): void {
    const style = document.getElementById("server-side-styles");

    if (style) {
      style.parentNode?.removeChild(style);
    }
  }

  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

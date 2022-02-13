import App from "next/app";
import { SWRConfig } from "swr";
import "./globals.css";

import fetchJson from "lib/fetchJson";
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
      // TODO: check for polling config
      // https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/pages/_app.tsx
      <SWRConfig
        value={{
          fetcher: fetchJson,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    );
  }
}

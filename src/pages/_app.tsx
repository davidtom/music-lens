import App from "next/app";
import { SWRConfig } from "swr";
import { ThemeProvider } from "react-jss";
import "./globals.css";

import { theme } from "lib/theme";
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
      // https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/pages/_app.tsx
      <SWRConfig
        value={{
          fetcher: fetchJson,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        {/* ThemeProvider must be here in order to pass theme: https://stackoverflow.com/a/53398987 */}
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SWRConfig>
    );
  }
}

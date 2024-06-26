import { createUseStyles } from "react-jss";
import Head from "next/head";

import Theme from "lib/theme";
import Header from "components/Header";

const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    padding: `0px ${theme.spacing(4)}px`,
  },
  main: {
    minHeight: "100vh",
    padding: `${theme.spacing(4)}px 0px`,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: 0,
    textAlign: "center",
  },
  footer: {
    display: "flex",
    flex: 1,
    padding: `${theme.spacing(4)}px 0px`,
    borderTop: "1px solid #eaeaea",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Layout: React.FC = ({ children }) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Head>
        <title>Music Lens</title>
        <meta
          name="description"
          content="View your music listening history, stats, and more"
        />
        {/* TODO: new favicon */}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script async data-api="/sb-api" src="/sb.js"></script>
      </Head>
      <Header />
      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/davidtom"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by David Tomczyk
        </a>
      </footer>
    </div>
  );
};

export default Layout;

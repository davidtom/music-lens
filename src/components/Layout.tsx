import { createUseStyles } from "react-jss";
import Head from "next/head";

import Header from "./Header";

const useStyles = createUseStyles(() => ({
  container: {
    padding: "0 2rem",
  },
  main: {
    minHeight: "100vh",
    padding: "4rem 0",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    margin: 0,
    lineHeight: 1.15,
    fontSize: "4rem",
    textAlign: "center",
  },
  footer: {
    display: "flex",
    flex: 1,
    padding: "2rem 0",
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
        <title>Spotify Play Tracker</title>
        <meta name="description" content="TODO: describe this app" />
        {/* TODO: new favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Spotify Play Tracker</h1>
        {children}
      </main>

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

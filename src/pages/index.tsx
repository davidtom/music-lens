import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { createUseStyles } from "react-jss";

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
  description: {
    margin: "4rem 0",
    lineHeight: 1.5,
    fontSize: "1.5rem",
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

// TODO: check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
const Home: NextPage = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Next</title>
        <meta name="description" content="TODO: describe this app" />
        {/* TODO: new favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Spotify Next</h1>

        <div className={styles.description}>
          <Link href={"/api/login"} passHref>
            {/*
            TODO: this should handle login errors
            for inspieration: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/pages/login.tsx
            */}

            <button>Log In</button>
          </Link>
        </div>
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

export default Home;

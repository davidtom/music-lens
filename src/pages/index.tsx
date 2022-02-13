import type { NextPage } from "next";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({
  // FIXME: revisit
  container: {
    margin: "4rem 0",
    lineHeight: 1.5,
    fontSize: "1.5rem",
    textAlign: "center",
  },
}));

// TODO: check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
const Home: NextPage = () => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.container}>Index Page</div>
    </>
  );
};

export default Home;

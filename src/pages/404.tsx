type Custom404Props = {
  type: "Page" | "User";
};

const Custom404: React.FC<Custom404Props> = ({ type = "Page" }) => {
  return <h2>{`404 - ${type} Not Found`}</h2>;
};

export default Custom404;

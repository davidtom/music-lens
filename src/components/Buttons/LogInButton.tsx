// TODO: all button styles should be such that they look like buttons (and therefore dont
// act/change after clicking like an anchor tag does)
const LogInButton: React.FC = () => {
  return <a href={"/api/login"}>Log In</a>;
};

export default LogInButton;

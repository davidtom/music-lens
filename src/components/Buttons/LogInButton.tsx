import Link from "next/link";

// TODO: all button styles should be such that they look like buttons (and therefore dont
// act/change after clicking like an anchor tag does)
const LogInButton: React.FC = () => {
  return (
    <Link href={"/api/login"} passHref>
      <a>Log In</a>
    </Link>
  );
};

export default LogInButton;

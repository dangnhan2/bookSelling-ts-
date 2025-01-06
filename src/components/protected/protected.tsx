import { useCurrentApp } from "@/context/app.context";
import { Button, Result } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();

  const handleLogin = () => {
    navigate("/login");
  };

  if (isAuthenticated === false) {
    return (
      <div>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" onClick={handleLogin}>
              Log in
            </Button>
          }
        />
      </div>
    );
  }

  const isAdminRoute = location.pathname.includes("admin");

  if (isAuthenticated === true && isAdminRoute === true) {
    const role = user?.role;
    if (role !== "ADMIN") {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary">
              <Link to={"/"}>Back Home</Link>
            </Button>
          }
        />
      );
    }
  }
  return <>{props.children}</>;
};
export default ProtectedRoute;

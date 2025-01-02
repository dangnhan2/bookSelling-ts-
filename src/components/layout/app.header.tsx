import { Outlet } from "react-router-dom";

const AppHeader = () => {
  return (
    <>
      <div>AppHeader</div>
      <Outlet></Outlet>
    </>
  );
};
export default AppHeader;

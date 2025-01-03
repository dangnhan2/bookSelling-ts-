import { useCurrentApp } from "@/context/app.context";
import { Outlet } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

const AppHeader = () => {
  const { isAppLoading } = useCurrentApp();
  return (
    <>
      {isAppLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <BeatLoader size={20} />
        </div>
      ) : (
        <>
          <div>AppHeader</div>
          <Outlet></Outlet>
        </>
      )}
    </>
  );
};
export default AppHeader;

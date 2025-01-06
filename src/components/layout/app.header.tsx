import { useCurrentApp } from "@/context/app.context";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../img/logo.jpg";
import {
  Avatar,
  Badge,
  Divider,
  Dropdown,
  Input,
  MenuProps,
  Space,
  type GetProps,
} from "antd";
import { IoCartOutline } from "react-icons/io5";
import "styles/header.scss";
import { doLogout } from "@/services/api";
import { useState } from "react";

type SearchProps = GetProps<typeof Input.Search>;

const AppHeader = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated, isAuthenticated } =
    useCurrentApp();
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const handleLogout = async () => {
    //todo
    const res = await doLogout();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/">Tài khoản</Link>,
    },

    user?.role === "ADMIN"
      ? {
          key: "admin",
          label: <Link to="/admin">Trang quản trị</Link>,
        }
      : null,

    {
      key: "history",
      label: <Link to="/">Lịch sử mua hàng</Link>,
    },

    {
      key: "logout",
      label: <a onClick={() => handleLogout()}>Đăng xuất</a>,
    },
  ];

  const avatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  return (
    <>
      <>
        <div className="container">
          <div className="container_brand">
            <img src={logo} alt="Logo" />
            <span className="brandname">Happy Shop</span>
          </div>

          <div className="container_search">
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </div>

          <div className="container_cart">
            <div className="container_cart-icon">
              <IoCartOutline />
              <div className="container_cart-badge">
                <Badge count={5}></Badge>
              </div>
            </div>
          </div>

          {isAuthenticated === false ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{ fontSize: "15px", cursor: "pointer" }}
                onClick={handleRegister}
              >
                Đăng ký
              </div>
              <Divider type="vertical"></Divider>
              <div
                style={{ fontSize: "15px", cursor: "pointer" }}
                onClick={handleLogin}
              >
                Đăng nhập
              </div>
            </div>
          ) : (
            <Dropdown menu={{ items: items }}>
              <Space>
                <div
                  className="container_info"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="container_avatar">
                    <Avatar size="large" src={avatar} />
                  </div>
                  <div className="container_name">{user?.fullName}</div>
                </div>
              </Space>
            </Dropdown>
          )}
        </div>

        <Outlet></Outlet>
      </>
    </>
  );
};
export default AppHeader;

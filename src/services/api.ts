import axios from "./axios.customize";
export const doRegister = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  return axios.post<IBackendRes<ILogin>>(`/api/v1/user/register`, {
    fullName,
    email,
    password,
    phone,
  });
};

export const doLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<ILogin>>(
    `/api/v1/auth/login`,
    {
      username,
      password,
    },
    {
      headers: {
        delay: 3000,
      },
    }
  );
};

export const fetchAccount = () => {
  return axios.get<IBackendRes<IUser>>(`/api/v1/auth/account`, {
    headers: {
      delay: 3000,
    },
  });
};

export const doLogout = () => {
  return axios.post(`/api/v1/auth/logout`);
};

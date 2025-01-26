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
  return axios.get<IBackendRes<IFetchAccount>>(
    `/api/v1/auth/account`
    //   , {
    //   headers: {
    //     delay: 3000,
    //   },
    // }
  );
};

export const doLogout = () => {
  return axios.post(`/api/v1/auth/logout`);
};
//query: string
export const getUsers = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(
    `/api/v1/user${query}`
  );
};

export const doCreateUser = (
  fullName: string,
  password: string,
  email: string,
  phone: string
) => {
  return axios.post<IBackendRes<IModelPaginate<IUserTable>>>(`/api/v1/user`, {
    fullName,
    password,
    email,
    phone,
  });
};

export const doCreateUserBulk = (
  arrayBulk: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
  }[]
) => {
  return axios.post<IBackendRes<IUserBulk>>(
    `/api/v1/user/bulk-create`,
    arrayBulk
  );
};

export const doEditUser = (_id: string, fullName: string, phone: string) => {
  return axios.put<IBackendRes<IUserUpdate>>(`/api/v1/user`, {
    _id,
    fullName,
    phone,
  });
};

export const doDeleteUser = (_id: string) => {
  return axios.delete<IBackendRes<IUserUpdate>>(`/api/v1/user/${_id}`);
};

export const getBooks = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(
    `/api/v1/book${query}`
  );
};

export const getCategory = () => {
  return axios.get<IBackendRes<IUserUpdate>>(`/api/v1/database/category`);
};

export const callUploadBookImg = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<
    IBackendRes<{
      fileUploaded: string;
    }>
  >({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const doCreateBook = (
  mainText?: string,
  author?: string,
  price?: number,
  category?: string,
  quantity?: number,
  thumbnail?: string,
  slider?: Array<string>
) => {
  return axios.post<IBackendRes<IBookTable>>(`/api/v1/book`, {
    mainText,
    author,
    price,
    category,
    quantity,
    thumbnail,
    slider,
  });
};

export const doUpdateBook = (
  id: string | undefined,
  thumbnail: string,
  slider: Array<string>,
  mainText: string | undefined,
  author: string | undefined,
  price: number | undefined,
  quantity: number | undefined,
  category: string | undefined
) => {
  return axios.put<IBackendRes<IBookTable>>(`/api/v1/book/${id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};

export const doDeleteBook = (id: string) => {
  return axios.delete<IBackendRes<IUserUpdate>>(`/api/v1/book/${id}`);
};

export const getBookById = (id: string) => {
  return axios.get<IBackendRes<IBookTable>>(`/api/v1/book/${id}`, {
    headers: {
      delay: 3000,
    },
  });
};

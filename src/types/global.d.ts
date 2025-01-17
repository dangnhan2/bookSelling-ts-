export {};
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T | Array<string>;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IUser {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    id: string;
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IUserTable {
    _id: string;
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: Array<string>;
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
  }

  interface IUserBulk {
    countSuccess: number;
    countError: number;
    detail: string;
  }

  interface IUserUpdate {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: null;
    upsertedCount: number;
    matchedCount: number;
  }
}

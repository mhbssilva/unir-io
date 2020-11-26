interface IUserAuthData {
  token: string;
}

interface IUserTokenData {
  id: number;
  uid: string;
  email: string;
  provider: string;
}

interface IUserLoggedData {
  user: IUserTokenData;
  token: string;
}

export { IUserAuthData, IUserTokenData, IUserLoggedData };

interface IUserShowOptions {
  id: number;
}

interface IUserListOptions {
  idsIn?: Array<number>;
  displayNameLike?: string;
  take?: number;
}

export { IUserShowOptions, IUserListOptions };

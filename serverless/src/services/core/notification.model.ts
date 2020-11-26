interface INotificationListOptions {
  idLessThan?: number;
  idMoreThan?: number;
  relations?: Array<"categories">;
  take?: number;
}

export { INotificationListOptions };

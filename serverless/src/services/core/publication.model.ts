import { User } from "../../db/mysql/entities/user";

enum ActionType {
  LIKE = "like",
  DISLIKE = "dislike"
}

interface IPublicationAddOptions {
  content: string;
  categories: number[];
  image: string;
  isAnonymous: boolean;
  user: User;
}

interface IPublicationAddCommentOptions {
  id: number;
  content: string;
  user: User;
}

interface IPublicationDeleteOptions {
  id: number;
  user: User;
}

interface IPublicationAddActionOptions {
  id: number;
  actionType: ActionType;
  user: User;
}

interface IPublicationAddReportOptions {
  id: number;
  content: string;
  user: User;
}

interface IPublicationIsAnonymityLimitExceededOptions {
  user: User;
}

interface IPublicationListOptions {
  categories?: number[];
  idLessThan?: number;
  take?: number;
}

interface IPublicationShowOptions {
  id: number;
}

interface IPublicationFilterOptions {
  id: number;
  categories?: number[];
  idLessThan?: number;
  idMoreThan?: number;
  take?: number;
}

export {
  IPublicationAddOptions,
  IPublicationDeleteOptions,
  IPublicationAddCommentOptions,
  IPublicationAddReportOptions,
  IPublicationAddActionOptions,
  IPublicationListOptions,
  IPublicationShowOptions,
  IPublicationFilterOptions,
  IPublicationIsAnonymityLimitExceededOptions
};

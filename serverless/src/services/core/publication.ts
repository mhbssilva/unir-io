import moment from "moment";
import {
  Connection,
  In,
  MoreThanOrEqual,
  FindManyOptions,
  LessThan,
  MoreThan
} from "typeorm";
import uuidv1 from "uuid/v1";
import { Errors } from "../../commons/errors/publication";
import { Category } from "../../db/mysql/entities/category";
import { Publication } from "../../db/mysql/entities/publication";
import AwsS3Service from "../external/aws-s3";
import { BaseService } from "./base";
import {
  IPublicationAddOptions,
  IPublicationIsAnonymityLimitExceededOptions,
  IPublicationListOptions,
  IPublicationAddReportOptions,
  IPublicationShowOptions,
  IPublicationFilterOptions,
  IPublicationAddCommentOptions,
  IPublicationAddActionOptions,
  IPublicationDeleteOptions
} from "./publication.model";
import { PublicationComment } from "../../db/mysql/entities/publication-comment";
import { PublicationAction } from "../../db/mysql/entities/publication-action";
import { PublicationReport } from "../../db/mysql/entities/publication-report";

type PublicationServiceAdd = (options: IPublicationAddOptions) => Promise<any>;
type PublicationServiceDelete = (
  options: IPublicationDeleteOptions
) => Promise<any>;
type PublicationServiceAddComment = (
  options: IPublicationAddCommentOptions
) => Promise<any>;
type PublicationServiceAddReport = (
  options: IPublicationAddReportOptions
) => Promise<any>;
type PublicationServiceAddAction = (
  options: IPublicationAddActionOptions
) => Promise<any>;
type PublicationServiceList = (
  options: IPublicationListOptions
) => Promise<any>;
type PublicationServiceShow = (
  options: IPublicationShowOptions
) => Promise<any>;
type PublicationServiceIsAnonymityLimitExceeded = (
  options: IPublicationIsAnonymityLimitExceededOptions
) => Promise<boolean>;
type PublicationServiceFilterOptions = (
  options?: any
) => FindManyOptions<Publication>;

class PublicationService extends BaseService {
  /**
   * Adds a publication to database.
   */
  add: PublicationServiceAdd = async (options: IPublicationAddOptions) => {
    try {
      const { user } = options;
      const awsS3Service = new AwsS3Service();
      const db: Connection = await this.getDb();
      let dbPublication: Publication = new Publication();

      if (
        options.isAnonymous &&
        (await this.isAnonymityLimitExceeded(options))
      ) {
        throw Errors.USER_EXCEEDED_ANONYMOUS_PUBLICATIONS_LIMIT();
      }

      if (!!!options.content && !!!options.image) {
        throw Errors.UNABLE_TO_ADD_PUBLICATION_WITHOUT_CONTENT_AND_IMAGE();
      }

      dbPublication.instituteId = 1;
      dbPublication.userId = user.id;
      dbPublication.content = options.content;
      dbPublication.isAnonymous = options.isAnonymous ? 1 : 0;
      dbPublication.createdAt = moment().toDate();
      dbPublication.updatedAt = moment().toDate();

      if (options.image) {
        const { imageUrl } = await awsS3Service.uploadImage(
          options.image,
          uuidv1()
        );
        dbPublication.imageUrl = imageUrl;
      }

      if (options.categories && options.categories.length) {
        dbPublication.categories = await db.getRepository(Category).find({
          where: { id: In(options.categories) }
        });
      }

      return await dbPublication.save();
    } catch (error) {
      throw Errors.UNABLE_TO_ADD_PUBLICATION({ error });
    }
  };

  delete: PublicationServiceDelete = async (
    options: IPublicationDeleteOptions
  ) => {
    try {
      const db: Connection = await this.getDb();
      const publication: Publication = await db
        .getRepository(Publication)
        .findOne(options.id);

      if (
        !publication ||
        (publication && publication.userId !== options.user.id)
      ) {
        throw Error();
      }

      publication.deletedAt = moment().toDate();

      return await publication.save();
    } catch (error) {
      throw Errors.UNABLE_TO_DELETE_PUBLICATION({ error });
    }
  };

  addComment: PublicationServiceAddComment = async (
    options: IPublicationAddCommentOptions
  ) => {
    try {
      let dbPublicationComment: PublicationComment = new PublicationComment();

      if (!options || !options.content) {
        throw Error();
      }

      dbPublicationComment.publicationId = options.id;
      dbPublicationComment.userId = options.user.id;
      dbPublicationComment.content = options.content;

      await dbPublicationComment.save();

      return await this.show(options);
    } catch (error) {
      throw Errors.UNABLE_TO_COMMENT_PUBLICATION({ error });
    }
  };

  addAction: PublicationServiceAddAction = async (
    options: IPublicationAddActionOptions
  ) => {
    try {
      const db: Connection = await this.getDb();
      let dbPublicationAction: PublicationAction = new PublicationAction();

      if (!options || !options.actionType) {
        throw Error();
      }

      const previousAction: Array<PublicationAction> = await db
        .getRepository(PublicationAction)
        .find({
          where: {
            publicationId: options.id,
            userId: options.user.id
          }
        });

      if (previousAction && previousAction.length) {
        await PublicationAction.remove(previousAction);
      }

      dbPublicationAction.publicationId = options.id;
      dbPublicationAction.userId = options.user.id;
      dbPublicationAction.actionType = options.actionType;

      await dbPublicationAction.save();

      return await this.show(options);
    } catch (error) {
      throw Errors.UNABLE_TO_ADD_ACTION_TO_PUBLICATION({ error });
    }
  };

  addReport: PublicationServiceAddReport = async (
    options: IPublicationAddReportOptions
  ) => {
    try {
      const db: Connection = await this.getDb();
      let dbPublicationReport: PublicationReport = new PublicationReport();

      if (!options || !options.content) {
        throw Error();
      }

      const previousReport: Array<PublicationReport> = await db
        .getRepository(PublicationReport)
        .find({
          where: {
            publicationId: options.id,
            userId: options.user.id
          }
        });

      if (previousReport && previousReport.length) {
        await PublicationReport.remove(previousReport);
      }

      dbPublicationReport.publicationId = options.id;
      dbPublicationReport.userId = options.user.id;
      dbPublicationReport.description = options.content;

      await dbPublicationReport.save();

      return await this.show(options);
    } catch (error) {
      throw Errors.UNABLE_TO_ADD_REPORT_TO_PUBLICATION({ error });
    }
  };

  isAnonymityLimitExceeded: PublicationServiceIsAnonymityLimitExceeded = async (
    options: IPublicationIsAnonymityLimitExceededOptions
  ) => {
    try {
      const { user } = options;
      const db: Connection = await this.getDb();

      const anonymousPublicationLast24Hours: Publication = await db
        .getRepository(Publication)
        .findOne({
          where: {
            userId: user.id,
            isAnonymous: 1,
            createdAt: MoreThanOrEqual(
              moment()
                .subtract(24, "hours")
                .toDate()
            )
          }
        });

      return anonymousPublicationLast24Hours ? true : false;
    } catch (error) {
      throw Errors.UNABLE_TO_VERIFY_IF_ANONYMITY_LIMIT_HAS_BEEN_EXCEEDED({
        error
      });
    }
  };

  list: PublicationServiceList = async (options: IPublicationListOptions) => {
    try {
      const filteredOptions = this.filterOptions(options);
      const db: Connection = await this.getDb();
      const publications: Array<Publication> = await db
        .getRepository(Publication)
        .find({
          ...filteredOptions
        });

      return publications;
    } catch (error) {
      throw Errors.UNABLE_TO_LIST_PUBLICATIONS({ error });
    }
  };

  show: PublicationServiceShow = async (options: IPublicationShowOptions) => {
    try {
      const filteredOptions = this.filterOptions(options);
      const db: Connection = await this.getDb();
      const publication: Publication = await db
        .getRepository(Publication)
        .findOne({
          ...filteredOptions
        });

      return publication;
    } catch (error) {
      throw Errors.UNABLE_TO_SHOW_PUBLICATION({ error });
    }
  };

  /**
   * Filter options from handlers
   * and entry points to make it
   * usable on service methods.
   */
  private filterOptions: PublicationServiceFilterOptions = (
    options?: IPublicationFilterOptions
  ) => {
    let filter: FindManyOptions<Publication> = {
      relations: ["categories", "actions", "comments", "user", "reports"],
      where: {
        id: null
      },
      order: {
        id: "DESC"
      },
      take: 50
    };

    if (options.id) {
      filter.where["id"] = options.id;
    } else if (options.idLessThan) {
      filter.where["id"] = LessThan(options.idLessThan);
    } else if (options.idMoreThan) {
      filter.where["id"] = MoreThan(options.idMoreThan);
    } else {
      delete filter.where["id"];
    }

    if (options.take) {
      filter.take = options.take && options.take < 50 ? options.take : 50;
    }

    return filter;
  };
}

export default PublicationService;

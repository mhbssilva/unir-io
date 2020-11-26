import { Connection, FindManyOptions, Like, In } from 'typeorm';
import { Errors } from '../../commons/errors/user';
import { User } from '../../db/mysql/entities/user';
import { BaseService } from './base';
import { IUserListOptions, IUserShowOptions } from './user.model';

type UserServiceShow = (options?: IUserShowOptions) => Promise<User>;
type UserServiceList = (options?: IUserListOptions) => Promise<User[]>;
type UserServiceFilterOptions = (
  options?: IUserListOptions
) => FindManyOptions<User>;

class UserService extends BaseService {
  /**
   * List all users
   * from database.
   */
  show: UserServiceShow = async (options?: IUserShowOptions) => {
    try {
      const db: Connection = await this.getDb();
      const user: User = await db.getRepository(User).findOne(options.id);
      return user;
    } catch (error) {
      throw Errors.UNABLE_TO_SHOW_USER({ error });
    }
  };

  /**
   * List all users
   * from database.
   */
  list: UserServiceList = async (options?: IUserListOptions) => {
    try {
      const filteredOptions = this.filterOptions(options);
      const db: Connection = await this.getDb();
      const usersList: Array<User> = await db.getRepository(User).find({
        ...filteredOptions
      });
      return usersList;
    } catch (error) {
      throw Errors.UNABLE_TO_LIST_USERS({ error });
    }
  };

  /**
   * Filter options from handlers
   * and entry points to make it
   * usable on service methods.
   */
  filterOptions: UserServiceFilterOptions = (options?: IUserListOptions) => {
    let filter: FindManyOptions<User> = {
      where: [],
      order: {
        createdAt: 'DESC'
      },
      take: 10
    };

    if (!options) {
      return filter;
    }

    if (options.idsIn && options.idsIn.length) {
      filter.where = {
        id: In(options.idsIn)
      };
    }

    if (options.displayNameLike) {
      filter.where = [
        {
          displayName: Like(`%${options.displayNameLike}%`)
        },
        {
          email: Like(`%${options.displayNameLike}%`)
        }
      ];
    }

    if (options.take) {
      filter.take = options.take && options.take < 100 ? options.take : 10;
    }

    return filter;
  };
}

export default UserService;

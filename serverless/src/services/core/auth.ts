import jwt from "jsonwebtoken";
import moment from "moment";
import { Connection } from "typeorm";
import { Errors } from "../../commons/errors/auth";
import appConfig from "../../config/app";
import { User } from "../../db/mysql/entities/user";
import FirebaseService from "../external/firebase";
import { IFirebaseUser } from "../external/firebase.model";
import { IUserAuthData, IUserLoggedData, IUserTokenData } from "./auth.model";
import { BaseService } from "./base";
import { InstituteUser } from "../../db/mysql/entities/institute-user";
import _ from "lodash";

type AuthServiceLogin = (authUser: IUserAuthData) => Promise<IUserLoggedData>;
type AuthServiceGetUserToken = (userData: IUserTokenData) => string;
type AuthServiceGetUserFromToken = (userToken: string) => Promise<User>;

class AuthService extends BaseService {
  /**
   * User authentication method using
   * firebase access token.
   */
  login: AuthServiceLogin = async (authUser: IUserAuthData) => {
    let firebaseUserData: IFirebaseUser;

    try {
      let firebaseService = new FirebaseService();
      firebaseUserData = await firebaseService.getUser(authUser.token);
    } catch (error) {
      throw Errors.USER_NOT_FOUND_IN_FIREBASE({ error });
    }

    let dbUser: User;
    let dbInstituteUser: InstituteUser = new InstituteUser();

    try {
      const firebaseUser = firebaseUserData.users[0];
      const providerUserInfo = firebaseUser.providerUserInfo[0];
      const db: Connection = await this.getDb();

      dbUser = await db
        .getRepository(User)
        .findOne({ where: { email: providerUserInfo.email } });

      if (dbUser) {
        const foundInstituteUser = await db
          .getRepository(InstituteUser)
          .findOne({
            where: {
              userId: dbUser.id,
              instituteId: 1,
            },
          });

        if (!!foundInstituteUser) {
          dbInstituteUser = foundInstituteUser;
        }
      } else {
        dbUser = new User();
        dbUser.displayName = firebaseUser.displayName;
        dbUser.email = providerUserInfo.email;
        dbUser.photoUrl = firebaseUser.photoUrl;
        dbUser.createdAt = moment().toDate();
      }

      dbUser.provider = providerUserInfo.providerId;
      dbUser.uid = firebaseUser.localId;
      dbUser.lastLoginAt = moment().toDate();
      dbUser.updatedAt = moment().toDate();

      dbUser = await dbUser.save();

      dbInstituteUser.instituteId = 1;
      dbInstituteUser.userId = dbUser.id;

      await dbInstituteUser.save();
    } catch (error) {
      throw Errors.UNABLE_TO_LOGIN({ authUser }, { error });
    }

    return {
      user: { ...dbUser },
      token: this.getUserToken({ ...dbUser }),
    };
  };

  /**
   * Encapsulate a user's information
   * into an encrypted JWT that is returned.
   */
  getUserToken: AuthServiceGetUserToken = (userData: IUserTokenData) => {
    let token = jwt.sign(
      {
        id: userData.id,
        uid: userData.uid,
        email: userData.email,
        provider: userData.provider,
      },
      appConfig.jwt.key,
      {
        expiresIn: "30 days",
      }
    );
    return token;
  };

  /**
   * Gets user information from a token
   * encrypted by the getUserToken() method.
   */
  getUserFromToken: AuthServiceGetUserFromToken = async (userToken: string) => {
    let dbUser: User;
    let tokenUser: IUserTokenData;

    try {
      const decodedToken: any = jwt.verify(userToken, appConfig.jwt.key);
      tokenUser = {
        id: decodedToken.id,
        uid: decodedToken.uid,
        email: decodedToken.email,
        provider: decodedToken.provider,
      };
    } catch (e) {
      throw Errors.INVALID_TOKEN(userToken);
    }

    try {
      const db: Connection = await this.getDb();

      dbUser = await db.getRepository(User).findOne({ id: tokenUser.id });

      if (
        !dbUser ||
        dbUser.id != tokenUser.id ||
        dbUser.uid != tokenUser.uid ||
        dbUser.email != tokenUser.email ||
        dbUser.provider != tokenUser.provider
      ) {
        throw new Error();
      }
    } catch (e) {
      throw Errors.USER_NOT_FOUND(userToken, dbUser);
    }

    return dbUser;
  };
}

export default AuthService;

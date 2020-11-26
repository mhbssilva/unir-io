import axios from 'axios';
import firebaseConfig from '../../config/firebase';
import { Errors } from '../../commons/errors/firebase';
import { IFirebaseUser } from './firebase.model';

type FirebaseServiceGetUser = (token: string) => Promise<IFirebaseUser>;

class FirebaseService {
  getUser: FirebaseServiceGetUser = async (token: string) => {
    try {
      let response: any = await axios({
        url: `${firebaseConfig.api.auth.url}:lookup?key=${firebaseConfig.api.key}`,
        method: 'post',
        timeout: 5 * 1000,
        data: {
          idToken: token
        }
      });
      return response.data;
    } catch (e) {
      throw Errors.USER_NOT_FOUND({ token }, { error: e });
    }
  };
}

export default FirebaseService;

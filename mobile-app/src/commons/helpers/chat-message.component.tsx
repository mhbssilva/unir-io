import { Moment } from 'moment';
import moment from 'moment';

const getUserMessageInfo = (userLastInteraction: Moment) => {
  if (moment().diff(userLastInteraction, 'minute') < 5) {
    return 'online agora';
  } else if (moment().diff(userLastInteraction, 'hour') < 1) {
    const diffInMinutes = moment().diff(userLastInteraction, 'minute');
    return `último acesso há ${diffInMinutes} minuto${
      diffInMinutes === 1 ? '' : 's'
    }`;
  } else if (moment().diff(userLastInteraction, 'day') < 1) {
    const diffInHours = moment().diff(userLastInteraction, 'hour');
    return `último acesso há ${diffInHours} hora${
      diffInHours === 1 ? '' : 's'
    }`;
  }
  return 'offline';
};

export { getUserMessageInfo };

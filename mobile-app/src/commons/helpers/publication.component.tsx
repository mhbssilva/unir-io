import { Moment } from 'moment';
import moment from 'moment';

const getPublicationInfo = (publicationDate: Moment) => {
  if (moment().diff(publicationDate, 'minute') < 1) {
    return `há menos de 1 minuto`;
  } else if (moment().diff(publicationDate, 'hour') < 1) {
    const diffInMinutes = moment().diff(publicationDate, 'minute');
    return `há ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
  } else if (moment().diff(publicationDate, 'day') < 1) {
    const diffInHours = moment().diff(publicationDate, 'hour');
    return `há ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
  } else if (moment().diff(publicationDate, 'month') < 1) {
    const diffInDays = moment().diff(publicationDate, 'day');
    return `há ${diffInDays} dia${diffInDays === 1 ? '' : 's'}`;
  } else if (moment().diff(publicationDate, 'year') < 1) {
    const diffInMonths = moment().diff(publicationDate, 'month');
    return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
  } else {
    const diffInYears = moment().diff(publicationDate, 'year');
    return `há ${diffInYears} ano${diffInYears === 1 ? '' : 's'}`;
  }
};

export { getPublicationInfo };

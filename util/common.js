import moment from 'moment';
import config from '@/config/app.config.json';

function dateMoment(date) {
  if (date) {
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate : moment.now();
  } else {
    return "";
  }
}

function formatDate(date) {
  if (date != undefined) return dateMoment(date).format(config.dateFormat);
  return "";
}

export default {
  formatDate
}
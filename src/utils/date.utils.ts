// Dependencies
import moment from 'moment';

// Export date utils
export const formatDate = (date: string) => {
  const diff = moment.duration(moment().diff(date)).days();

  if (diff === 0) {
    return moment(date).format('[Today] hh:mm');
  } else if (diff === 1) {
    return moment(date).format('[Yesterday] hh:mm');
  } else if (diff <= 30) {
    return `${diff} days ago`;
  } else {
    return moment(date).format('YYYY-MM-DD hh:mm');
  }
};

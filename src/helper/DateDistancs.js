import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
export function getDateDistance(date) {
  const dateObj = new Date(date);
  const distance = formatDistanceToNow(dateObj, {
    addSuffix: true,
    includeSeconds: true,
    locale: ar,
  });
  return distance;
}

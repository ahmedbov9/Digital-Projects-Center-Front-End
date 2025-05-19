import { errorAlert } from '../website/components/Alertservice';

export default function handleApiError(error) {
  const statusCode = error?.response?.data?.statusCode;
  if (statusCode === 429) {
    errorAlert('تم حظر عنوان IP الخاص بك مؤقتًا. يرجى المحاولة لاحقًا.');
  } else {
    errorAlert('حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.');
  }

  return error;
}

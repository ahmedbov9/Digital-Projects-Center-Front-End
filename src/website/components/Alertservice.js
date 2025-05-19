import Swal from 'sweetalert2';

export const confirmAlert = async ({
  message = 'هل أنت متأكد؟',
  title = 'تأكيد',
  icon = 'warning',
  dangerMode = true,
  confirmButtonText = 'نعم',
  cancelButtonText = 'لا',
} = {}) => {
  const result = await Swal.fire({
    title,
    text: message,
    icon,
    dangerMode,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed;
};

export const loadingAlert = (title = 'جاري الإرسال...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const successAlert = (message = 'تم بنجاح') => {
  Swal.fire({
    icon: 'success',
    title: 'نجاح',
    text: message,
  });
};

export const errorAlert = (message = 'حدث خطأ ما') => {
  Swal.fire({
    icon: 'error',
    title: 'خطأ',
    text: message,
  });
};
export const warningAlert = (message = 'تحذير') => {
  Swal.fire({
    icon: 'warning',
    title: 'تحذير',
    text: message,
  });
};
export const closeAlert = () => {
  if (Swal.isLoading()) {
    Swal.close();
  }
};

export const confirmWhenWrite = async ({
  title = 'تأكيد الحذف',
  message = 'يرجى كتابة بريدك الإلكتروني لتأكيد حذف الحساب.',
  inputPlaceholder = 'البريد الإلكتروني',
  type = '',
  confirmButtonText = 'حذف',
  cancelButtonText = 'إلغاء',
  icon = 'warning',
} = {}) => {
  const result = await Swal.fire({
    title,
    html: `
      <p>${message}</p>
      <input type="${
        type || 'text'
      }" id="emailInput" class="swal2-input" placeholder="${inputPlaceholder}" dir="ltr">
    `,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    focusConfirm: false,
    preConfirm: () => {
      const email = Swal.getPopup().querySelector('#emailInput').value;
      return email;
    },
  });

  return result.isConfirmed ? result.value : null;
};

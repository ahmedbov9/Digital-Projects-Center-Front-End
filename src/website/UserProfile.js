import NavBar from './components/Navbar';
import Cookie from 'cookie-universal';
import { Link } from 'react-router-dom';
import { getDateDistance } from '../helper/DateDistancs';
import {
  closeAlert,
  confirmAlert,
  confirmWhenWrite,
  errorAlert,
  loadingAlert,
} from './components/Alertservice';
import Footer from './components/Footer';
import { Button } from 'react-bootstrap';
import { API } from '../Api/Api';
import { Axios } from '../Api/axios';
import { UserContext } from '../context/UserContext';
import { useContext, useEffect, useState } from 'react';

export default function UserProfile() {
  const cookie = Cookie();
  const { currentUser } = useContext(UserContext);

  // عرض سبينر أو رسالة انتظار إذا لم تكن بيانات المستخدم جاهزة
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
        <NavBar margin={'50px'} />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
        <Footer margin={'100px'} />
      </div>
    );
  }

  async function handleLogout() {
    const confirmed = await confirmAlert({
      message: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      title: 'تأكيد',
      icon: 'warning',
    });
    if (!confirmed) return;

    // Clear the token from cookies
    cookie.remove('token');
    // Redirect to login page
    window.location.pathname = '/';
  }

  const handleDeleteAccount = async () => {
    const email = await confirmWhenWrite({
      title: 'تأكيد الحذف',
      message: 'يرجى كتابة بريدك الإلكتروني لتأكيد حذف الحساب.',
      inputLabel: 'البريد الإلكتروني',
      inputPlaceholder: 'البريد الإلكتروني',
    });
    if (!email) return;
    const confirmed = await confirmAlert({
      message: 'هل أنت متأكد أنك تريد حذف حسابك؟',
      title: 'تأكيد',
      icon: 'danger',
    });
    if (!confirmed) return;

    try {
      const response = await Axios.delete(
        `${API.deleteAccount}/${currentUser._id}`,
        {
          data: { email },
        }
      );
      if (response.status === 200) {
        cookie.remove('token');
        window.location.pathname = '/';
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      errorAlert(error?.response.data.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#e0e3e5' }}>
      <NavBar margin={'50px'} />
      <div>
        <div className="container d-flex vh-100">
          <div
            className="card shadow-lg col-lg-12 col-md-12"
            style={{ borderRadius: '15px' }}
          >
            <div className="card-body p-4">
              <h2 className="text-center text-primary mb-4">الملف الشخصي</h2>
              <p className="text-center text-muted">
                مرحبًا بك! يرجى تسجيل الدخول للوصول إلى حسابك.
              </p>
              <div>
                <h5 className="mb-3">
                  اسم المستخدم: {currentUser?.firstName} {currentUser?.lastName}
                </h5>
                <h5 className="mb-3">
                  البريد الإلكتروني: {currentUser?.email}
                </h5>
                <h5 className="mb-3">
                  رقم الهاتف: {currentUser?.mobileNumber}
                </h5>
                <h5 className="mb-3">
                  تاريخ التسجيل : {getDateDistance(currentUser?.createdAt)}
                </h5>
                <button onClick={handleLogout} className="btn btn-danger mt-3">
                  تسجيل الخروج
                </button>
                <div className="mt-4 d-flex gap-3 flex-wrap">
                  <Link
                    to={`/edit-profile/${currentUser?._id}`}
                    className="btn btn-primary mt-2"
                  >
                    تعديل الملف الشخصي
                  </Link>
                  <Link
                    to="/change-password"
                    className="btn btn-secondary mt-2 ms-2"
                  >
                    تغيير كلمة المرور
                  </Link>
                  <Button
                    onClick={handleDeleteAccount}
                    className="btn btn-danger mt-2 ms-2"
                  >
                    حذف الحساب
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer margin={'100px'} />
    </div>
  );
}

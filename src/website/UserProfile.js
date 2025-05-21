import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Cookie from 'cookie-universal';

import NavBar from './components/Navbar';
import Footer from './components/Footer';
import { API } from '../Api/Api';
import { Axios } from '../Api/axios';
import { UserContext } from '../context/UserContext';
import { getDateDistance } from '../helper/DateDistancs';
import {
  confirmAlert,
  confirmWhenWrite,
  errorAlert,
} from './components/Alertservice';

export default function UserProfile() {
  const cookie = Cookie();
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <NavBar />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLogout = async () => {
    const confirmed = await confirmAlert({
      message: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      title: 'تأكيد',
      icon: 'warning',
    });
    if (!confirmed) return;

    cookie.remove('token');
    window.location.pathname = '/';
  };

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
        { data: { email } }
      );
      if (response.status === 200) {
        cookie.remove('token');
        window.location.pathname = '/';
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      errorAlert(error?.response?.data?.message || 'حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <NavBar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-5">
                <h2 className="text-center text-primary mb-4">الملف الشخصي</h2>
                <p className="text-center text-muted mb-5">
                  مرحبًا {currentUser.firstName}! إليك تفاصيل حسابك.
                </p>

                <div className="mb-4">
                  <h5>
                    <strong>الاسم:</strong> {currentUser.firstName}{' '}
                    {currentUser.lastName}
                  </h5>
                  <h5>
                    <strong>البريد الإلكتروني:</strong> {currentUser.email}
                  </h5>
                  <h5>
                    <strong>رقم الجوال:</strong> {currentUser.mobileNumber}
                  </h5>
                  <h5>
                    <strong>تاريخ التسجيل:</strong>{' '}
                    {getDateDistance(currentUser.createdAt)}
                  </h5>
                </div>

                <div className="row mt-4 g-3">
                  <div className="col-md-6 d-grid">
                    <Link
                      to={`/edit-profile/${currentUser._id}`}
                      className="btn btn-primary"
                    >
                      تعديل الملف الشخصي
                    </Link>
                  </div>
                  <div className="col-md-6 d-grid">
                    <Link
                      to="/change-password"
                      className="btn btn-outline-secondary"
                    >
                      تغيير كلمة المرور
                    </Link>
                  </div>
                  <div className="col-md-6 d-grid">
                    <Button variant="danger" onClick={handleDeleteAccount}>
                      حذف الحساب
                    </Button>
                  </div>
                  <div className="col-md-6 d-grid">
                    <Button variant="dark" onClick={handleLogout}>
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

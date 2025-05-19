import { Form } from 'react-bootstrap';
import NavBar from '../components/Navbar';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../Api/Api';
import Cookie from 'cookie-universal';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
import Footer from '../components/Footer';
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const cookies = Cookie();

  useEffect(() => {
    const token = cookies.get('token');

    if (token) {
      navigate('/');
      errorAlert(
        'لا يمكنك الدخول الى صفحة تسجيل الدخول سجل خروج ثم ادخل مرة اخرى'
      );
    }
  });

  function changeHandler(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    loadingAlert('جاري تسجيل الدخول...');
    try {
      const response = await axios.post(API.login, form);
      if (response.status === 200) {
        console.log('Login successful');
        successAlert('تم تسجيل الدخول بنجاح');
        closeAlert();
        cookies.set('token', response.data.token);
        navigate('/');
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      if (error.response.data.message === 'هذا الايميل غير مفعل بعد') {
        closeAlert();
        successAlert(error.response.data.message);
        setTimeout(() => {
          navigate('/verify', {
            state: {
              email: form.email,
              verifyType: 'resendOTP',
            },
          });
        }, 1500);
      }
      console.error('Error during login:', error);
      errorAlert(error.response.data.message);
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#e0e3e5',
      }}
    >
      <NavBar margin="50px" />

      {/* المحتوى الرئيسي */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div
          className="card shadow-lg"
          style={{ width: '700px', borderRadius: '15px' }}
        >
          <div className="card-header text-center p-3 bg-primary">
            <h2 className="text-center text-white">تسجيل الدخول</h2>
          </div>
          <div className="card-body p-4">
            <p className="text-center text-muted">
              مرحبًا بك! يرجى تسجيل الدخول للوصول إلى حسابك.
            </p>
            <Form
              className="shadow p-4 rounded bg-white"
              onSubmit={handleSubmit}
            >
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fw-bold text-secondary">
                  البريد الإلكتروني <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ادخل بريدك الإلكتروني"
                  required
                  size="md"
                  onChange={changeHandler}
                  name="email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="fw-bold text-secondary">
                  كلمة المرور <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور"
                  required
                  size="md"
                  onChange={changeHandler}
                  name="password"
                />
              </Form.Group>
              <div className="text-center">
                <Button type="submit" className="btn btn-primary btn-md px-4">
                  تسجيل الدخول
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <Link
                to="/forget-password"
                className="text-decoration-none text-primary"
              >
                هل نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="text-center mt-3">
              <p className="text-muted">
                ليس لديك حساب؟{' '}
                <Link
                  to="/register"
                  className="text-decoration-none text-primary"
                >
                  تسجيل حساب جديد
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer margin="50px" />
    </div>
  );
}

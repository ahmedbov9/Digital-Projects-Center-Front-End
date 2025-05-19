import { Form } from 'react-bootstrap';
import NavBar from '../components/Navbar';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../../Api/Api';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Footer from '../components/Footer';
import Cookie from 'cookie-universal';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';

export default function Register() {
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cookies = Cookie();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

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

  async function submitHandler(e) {
    e.preventDefault();
    loadingAlert('جاري تسجيل الحساب...');
    setLoading(true);
    try {
      const response = await axios.post(`${API.registerStepOne}`, form);
      if (response.status === 200) {
        setResponse(response.status);
        closeAlert();
        successAlert(response.data.message);
        navigate('/verify', {
          state: {
            email: form.email,
            verifyType: 'register',
          },
        });
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response.data.message);
    }
  }

  return (
    <div style={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <NavBar margin="100px" />
      <div className="d-flex mt-5 justify-content-center align-items-center ">
        <div
          className="card shadow-lg"
          style={{ width: '700px', borderRadius: '15px' }}
        >
          <div className="card-header p-3 bg-primary text-white text-center">
            <h2 className="mb-0">تسجيل حساب جديد</h2>
          </div>
          <div className="card-body p-4">
            <p className="text-center text-muted">
              مرحبًا بك! يرجى إنشاء حساب جديد للانضمام إلينا.
            </p>
            <Form
              className="shadow p-4 rounded bg-white"
              onSubmit={submitHandler}
            >
              <Form.Group className="mb-3" controlId="firstname">
                <Form.Label className="fw-bold text-secondary">
                  الاسم الأول <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل اسمك الأول"
                  size="md"
                  onChange={changeHandler}
                  name="firstName"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastname">
                <Form.Label className="fw-bold text-secondary">
                  اسم العائلة <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل اسم عائلتك"
                  size="md"
                  onChange={changeHandler}
                  name="lastName"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fw-bold text-secondary">
                  البريد الإلكتروني <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ادخل بريدك الإلكتروني"
                  size="md"
                  onChange={changeHandler}
                  name="email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="mobileNumber">
                <Form.Label className="fw-bold text-secondary">
                  رقم الهاتف <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+966555555555"
                  size="md"
                  onChange={changeHandler}
                  name="mobileNumber"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="fw-bold text-secondary">
                  كلمة المرور <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور"
                  size="md"
                  onChange={changeHandler}
                  name="password"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label className="fw-bold text-secondary">
                  تأكيد كلمة المرور <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="أعد إدخال كلمة المرور"
                  size="md"
                  onChange={changeHandler}
                  name="confirmPassword"
                  required
                />
              </Form.Group>

              {response === 201 ? (
                <div className="alert alert-success text-end" role="alert">
                  تم تسجيل حسابك بنجاح!
                </div>
              ) : response ? (
                <div className="alert alert-danger text-end" role="alert">
                  {typeof response === 'object' ? response.message : response}
                </div>
              ) : null}
              <div className="text-center">
                <Button type="submit" className="btn btn-primary btn-md px-4">
                  تسجيل حساب جديد
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <p className="text-muted">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-decoration-none text-primary">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer margin={'150px'} />
    </div>
  );
}

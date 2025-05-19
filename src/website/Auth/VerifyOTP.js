// VerifyOTP.jsx

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Cookie from 'cookie-universal';

import { API } from '../../Api/Api';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';

const VerifyOTP = () => {
  const location = useLocation();
  const { email, verifyType } = location.state || {};

  const inputsRef = useRef([]);
  const [refresher, setRefresher] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cookie = new Cookie();
  const resendBtnRef = useRef();
  // استخراج كود OTP من الحقول
  const getOTP = () => {
    return inputsRef.current.map((input) => input?.value || '').join('');
  };
  // ...existing code...
  const [counter, setCounter] = useState(0);

  function disableButtonAfterSendOTP() {
    const ref = resendBtnRef.current;
    const waitSec = 60;
    setCounter(waitSec);
    if (ref) {
      ref.disabled = true;
    }

    let interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (ref) {
            ref.disabled = false;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // عند تغيير محتوى أحد الخانات
  const handleInputChange = (e, index) => {
    let value = e.target.value.replace(/\D/g, ''); // السماح فقط بالأرقام
    e.target.value = value;

    if (value.length === 1 && index < inputsRef.current.length - 1) {
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const resendOtp = async () => {
    loadingAlert('جاري إرسال رمز التحقق...');
    try {
      const response = await axios.post(API.resendOTP, { email });
      closeAlert();
      if (response.status === 200) {
        successAlert('تم إرسال رمز التحقق بنجاح إلى بريدك الإلكتروني');
        disableButtonAfterSendOTP();
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error?.response?.data?.message || 'حدث خطأ');
    }
  };

  useEffect(() => {
    if (verifyType === 'resendOTP') {
      resendOtp();
    } else if (!verifyType) {
      errorAlert('غير مسموح لك بالدخول الى هذه الصفحة');
    }
  }, []);

  useEffect(() => {
    if (cookie.get('token')) {
      errorAlert('لقد قمت بتسجيل الدخول بالفعل');
      if (refresher === 200) {
        successAlert('تم التحقق من حسابك بنجاح');
      }
      setTimeout(() => {
        window.location.pathname = '/';
      }, 1500);
    }
  }, [refresher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = getOTP();

    loadingAlert('جاري التحقق من رمز التحقق...');
    try {
      const response = await axios.post(API.verifyOtpAndRegister, {
        email,
        otp,
      });

      closeAlert();
      if (response.status === 201) {
        cookie.set('token', response.data.token);
        successAlert(response.data.message);
        setRefresher(200);
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error?.response?.data?.message || 'فشل التحقق');
    }
  };

  return (
    <div style={{ backgroundColor: '#e0e3e5' }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="card p-4 shadow"
          style={{ maxWidth: '400px', width: '100%' }}
        >
          <h2 className="text-center mb-4">تفعيل الحساب</h2>
          <p className="text-center text-muted">
            يرجى إدخال رمز التحقق (OTP) المرسل إلى بريدك الإلكتروني.
          </p>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between mb-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  className="text-center mx-1"
                  style={{ width: '40px' }}
                  maxLength="1"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleInputChange(e, index)}
                />
              ))}
            </div>
            <div className="d-flex justify-content-center align-items-center flex-column gap-2">
              <Button type="submit" className="w-100" variant="primary">
                تحقق
              </Button>
              <Button
                type="button"
                className="w-100"
                variant="outline-primary"
                onClick={resendOtp}
                ref={resendBtnRef}
                disabled={counter > 0}
              >
                {counter > 0
                  ? `إعادة إرسال رمز التحقق بعد ${counter} ثانية`
                  : 'اعادة إرسال رمز التحقق'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

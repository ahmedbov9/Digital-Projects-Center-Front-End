import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
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
  const resendBtnRef = useRef();
  const [counter, setCounter] = useState(0);
  const [refresher, setRefresher] = useState(0);
  const cookie = new Cookie();

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const getOTP = () =>
    inputsRef.current.map((input) => input?.value || '').join('');

  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    if (value.length === 1 && index < inputsRef.current.length - 1) {
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) nextInput.focus();
    }

    if (value === '' && e.nativeEvent.inputType === 'deleteContentBackward') {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const disableButtonAfterSendOTP = () => {
    const ref = resendBtnRef.current;
    const waitSec = 60;
    setCounter(waitSec);
    if (ref) ref.disabled = true;

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (ref) ref.disabled = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
      if (refresher === 200) successAlert('تم التحقق من حسابك بنجاح');
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
    <div
      style={{
        backgroundColor: '#e0e3e5',
        minHeight: '100vh',
        direction: 'ltr',
      }}
    >
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Card className="shadow-lg w-100" style={{ maxWidth: '480px' }}>
          <Card.Body className="p-4">
            <h3 className="text-center mb-3">تفعيل الحساب</h3>
            <p className="text-center text-muted mb-4">
              أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
            </p>

            <Form onSubmit={handleSubmit}>
              <Row className="gx-2 justify-content-center mb-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Col xs={2} key={index}>
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      className="text-center fs-5 fw-bold"
                      style={{
                        height: '50px',
                        borderRadius: '0.5rem',
                      }}
                      required
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </Col>
                ))}
              </Row>

              <div className="d-grid gap-2">
                <Button type="submit" variant="primary">
                  تحقق
                </Button>

                <Button
                  type="button"
                  variant="outline-primary"
                  onClick={resendOtp}
                  ref={resendBtnRef}
                  disabled={counter > 0}
                >
                  {counter > 0
                    ? `إعادة الإرسال خلال ${counter} ثانية`
                    : 'إعادة إرسال رمز التحقق'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default VerifyOTP;

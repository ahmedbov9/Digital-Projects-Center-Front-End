import { Form } from 'react-bootstrap';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import { Button, Container } from 'react-bootstrap';
import { useState } from 'react';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
import { API } from '../../Api/Api';
import axios from 'axios';

export default function ForgetPassword() {
  const [email, setEmail] = useState(null);
  const hundleSubmit = async (e) => {
    e.preventDefault();
    loadingAlert('جاري ارسال رابط تغيير كلمة المرور...');
    try {
      const apiEndPoint = `${API.forgotPassword}`;
      const data = { email };
      const response = await axios.post(apiEndPoint, data);
      if (response.status === 200) {
        closeAlert();
        successAlert('تم ارسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني');
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response.data.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#e0e3e5' }}>
      <NavBar />
      <Container>
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center">نسيت كلمة المرور</h2>
              </div>
              <div className="card-body">
                <Form onSubmit={hundleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button className="w-100" type="submit">
                    إرسال
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

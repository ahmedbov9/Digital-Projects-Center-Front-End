import { Button, Form } from 'react-bootstrap';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
import axios from 'axios';
import { API } from '../../Api/Api';

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
    token: token,
    id: id,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    loadingAlert('جاري تغيير كلمة المرور...');
    try {
      const response = await axios.patch(`${API.resetPassword}`, form);
      if (response.status === 200) {
        closeAlert();
        successAlert(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      closeAlert();
      errorAlert(error.response.data.message);
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#e0e3e5',
      }}
    >
      <NavBar />

      <div className="container mt-5" style={{ flex: 1 }}>
        <div className="card shadow-sm col-lg-6 col-md-10 mx-auto">
          <div className="card-header bg-primary text-white p-3">
            <h2 className="text-center">تغيير كلمة المرور</h2>
          </div>
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>كلمة المرور الجديدة</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور الجديدة"
                  name="password"
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>تأكيد كلمة المرور الجديدة</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="أدخل تأكيد كلمة المرور الجديدة"
                  name="confirmPassword"
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                تغيير كلمة المرور
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

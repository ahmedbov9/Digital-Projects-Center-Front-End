import { Form, Button, Container, Card } from 'react-bootstrap';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Axios } from '../../Api/axios';
import { API } from '../../Api/Api';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
export default function ChangeUserPassword() {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    loadingAlert('جاري تحديث البيانات...');
    try {
      const response = await Axios.put(`${API.changeUserPassword}`, form);
      if (response.status === 201) {
        closeAlert();
        successAlert(response.data.message);
        setTimeout(() => {
          window.location.pathname = '/user-profile';
        }, 1500);
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
      <NavBar margin={'100px'} />
      <Container className=" min-vh-100">
        <Card className="shadow-lg col-lg-8 col-md-10 col-sm-12 mx-auto mt-5">
          <Card.Header className="bg-primary text-white text-center">
            <h3>تغيير كلمة المرور</h3>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="oldPassword"
                onSubmit={handleInputChange}
              >
                <Form.Label>كلمة المرور الحالية</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور الحالية"
                  value={form.oldPassword}
                  name="oldPassword"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label>كلمة المرور الجديدة</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور الجديدة"
                  value={form.newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmNewPassword">
                <Form.Label>تأكيد كلمة المرور الجديدة</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="تأكيد كلمة المرور الجديدة"
                  value={form.confirmPassword}
                  name="confirmPassword"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <div className="d-flex gap-3 justify-content-center">
                <Button variant="success" type="submit">
                  تعديل
                </Button>

                <Link to={'/user-profile'} className="btn btn-secondary">
                  رجوع
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}

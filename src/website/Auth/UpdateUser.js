import { Form, Button, Container, Card } from 'react-bootstrap';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Axios } from '../../Api/axios';
import { API } from '../../Api/Api';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
import { UserContext } from '../../context/UserContext';
export default function UpdateUser() {
  const { currentUser } = useContext(UserContext);

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    mobileNumber: currentUser?.mobileNumber || '',
    email: currentUser?.email || '',
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
      const response = await Axios.put(
        `${API.updateUser}/${currentUser._id}`,
        form
      );
      if (response.status === 201) {
        closeAlert();
        successAlert(response.data.message);
        setTimeout(() => {
          window.history.back();
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
            <h3>تعديل الملف الشخصي</h3>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="firstName"
                onSubmit={handleInputChange}
              >
                <Form.Label>اسم الاول :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل اسم الاول"
                  value={form.firstName}
                  name="firstName"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>اسم العائلة : </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل اسم العائلة"
                  value={form.lastName}
                  name="lastName"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your password"
                  value={form.email}
                  name="email"
                  onChange={handleInputChange}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>رقم الهاتف</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل رقم الهاتف"
                  value={form.mobileNumber}
                  name="mobileNumber"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>كلمة المرور الحاليه</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور الحاليه"
                  value={form.password}
                  name="password"
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

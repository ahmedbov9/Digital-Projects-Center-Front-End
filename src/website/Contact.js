import NavBar from './components/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../Api/Api';
import Footer from './components/Footer';

import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from './components/Alertservice';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = await confirmAlert({
      icon: 'warning',
      title: 'تأكيد',
      message: 'هل أنت متأكد أنك تريد إرسال الرسالة؟',
    });

    if (!confirmed) return;

    loadingAlert('جاري الإرسال...');

    try {
      const response = await axios.post(`${API.sendEmailMessage}`, formData);
      closeAlert();

      if (response.status === 200) {
        setFormData({ name: '', email: '', message: '' });

        successAlert(
          'تم إرسال الرسالة بنجاح، شكرًا لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.'
        );
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      console.error('حدث خطأ:', error);
      errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: '#e0e3e5' }} className="pb-5">
        <NavBar />

        <h1 className="text-center text-primary display-4 mt-3">تواصل معنا</h1>
        <p className="text-center text-muted lead">
          إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، لا تتردد في التواصل معنا
          عبر النموذج أدناه.
        </p>

        <div
          className="container mt-5 p-4 bg-white rounded shadow-sm"
          style={{ maxWidth: '800px' }}
        >
          <Form
            className="mx-auto bg-light p-4 rounded shadow-sm"
            onSubmit={handleSubmit}
          >
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="fw-bold">
                الاسم <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="أدخل اسمك"
                onChange={handleInputChange}
                value={formData.name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="fw-bold">
                البريد الإلكتروني <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="أدخل بريدك الإلكتروني"
                onChange={handleInputChange}
                value={formData.email}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label className="fw-bold">
                الرسالة <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                rows={5}
                placeholder="أدخل رسالتك"
                onChange={handleInputChange}
                value={formData.message}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold">
              إرسال
            </Button>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}

import Form from 'react-bootstrap/Form';
import NavBar from './components/Navbar';
import Button from 'react-bootstrap/Button';
import { Axios } from '../Api/axios';
import { API } from '../Api/Api';
import { useState } from 'react';
import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from './components/Alertservice';
import Footer from './components/Footer';
import { useUserContext } from '../context/UserContext';

export default function OrderService() {
  const { currentUser } = useUserContext();

  const [formData, setFormData] = useState({
    serviceType: '',
    serviceDetails: '',
    attachment: null,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    mobileNumber: currentUser.mobileNumber,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'attachment') {
      setFormData((prevData) => ({
        ...prevData,
        attachment: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = await confirmAlert({
      message: 'هل أنت متأكد أنك تريد إرسال الطلب؟',
      title: 'تأكيد',
      icon: 'warning',
    });
    if (!confirmed) return;
    loadingAlert('جاري الإرسال...');
    const formPayload = new FormData();
    formPayload.append('firstName', formData.firstName);
    formPayload.append('lastName', formData.lastName);
    formPayload.append('email', formData.email);
    formPayload.append('mobileNumber', formData.mobileNumber);
    formPayload.append('serviceType', formData.serviceType);
    formPayload.append('serviceDetails', formData.serviceDetails);

    if (formData.attachment) {
      formPayload.append('attachment', formData.attachment);
    }

    try {
      const response = await Axios.post(`${API.createOrder}`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setFormData({
          serviceType: '',
          serviceDetails: '',
          attachment: null,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          mobileNumber: currentUser.mobileNumber,
        });
        closeAlert();
        successAlert('تم ارسال الطلب بنجاح وسنعمل عليه في أقرب وقت ممكن');
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      console.error('حدث خطأ أثناء إرسال الطلب:', error);
      closeAlert();
      errorAlert(error.response.data.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#e0e3e5' }}>
      <NavBar />
      <div
        className="container py-4 pb-5"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <h1 className="text-center mb-3 display-5 text-primary">طلب خدمة</h1>
        <p className="text-center mb-4 text-muted lead">
          يرجى ملء النموذج أدناه لطلب الخدمة المطلوبة. سنقوم بالتواصل معك في
          أقرب وقت ممكن.
        </p>
        <Form className="shadow p-4 rounded bg-white" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="service">
            <Form.Label className="fw-bold text-secondary">
              الخدمة المطلوبة <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              size="md"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
            >
              <option value="">اختر خدمة</option>
              <option value="web-development">تطوير الويب</option>
              <option value="technical-consultation">استشارة تقنية</option>
              <option value="technical-support">دعم فني</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="attachment">
            <Form.Label className="fw-bold text-secondary">المرفقات</Form.Label>
            <Form.Control
              type="file"
              size="md"
              name="attachment"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="message">
            <Form.Label className="fw-bold text-secondary">
              تفاصيل الطلب <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="ادخل جميع تفاصيل الطلب هنا"
              size="md"
              name="serviceDetails"
              value={formData.serviceDetails}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" className="btn btn-primary btn-md px-4">
              إرسال الطلب
            </Button>
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  );
}

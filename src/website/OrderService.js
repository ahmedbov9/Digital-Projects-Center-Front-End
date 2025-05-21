import Form from 'react-bootstrap/Form';
import NavBar from './components/Navbar';
import Button from 'react-bootstrap/Button';
import { Axios } from '../Api/axios';
import { API } from '../Api/Api';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from './components/Alertservice';
import Footer from './components/Footer';
import { useUserContext } from '../context/UserContext';
import Card from 'react-bootstrap/Card';

const SERVICES = [
  {
    key: 'web-development',
    title: 'تطوير الويب',
    description: 'نقوم بتطوير مواقع ويب حديثة ومتجاوبة باستخدام أحدث التقنيات.',
    technicalList: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'MySQL',
      'PHP',
    ],
    image: '../Assets/web-development.jpg',
  },
  {
    key: 'technical-consultation',
    title: 'استشارة تقنية',
    technicalList: ['تخطيط المشروع', 'توجيه فني'],
    description: 'نقدم لك حلولاً تقنية تساعدك في اتخاذ قرارات ذكية لمشروعك.',
    image: '../Assets/technical_consultation.jpg',
  },
  {
    key: 'technical-support',
    title: 'دعم فني',
    technicalList: ['دعم فني', 'استكشاف الأخطاء وإصلاحها'],
    description: 'فريقنا جاهز لمساعدتك في حل المشكلات التقنية بسرعة وكفاءة.',
    image: '../Assets/technical_support.jpg',
  },
];

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

  const handleServiceSelect = (serviceKey) => {
    setFormData((prevData) => ({
      ...prevData,
      serviceType: serviceKey,
    }));
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
    Object.keys(formData).forEach((key) => {
      if (formData[key]) formPayload.append(key, formData[key]);
    });

    try {
      const response = await Axios.post(`${API.createOrder}`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      closeAlert();
      errorAlert(error?.response?.data?.message || 'حدث خطأ غير متوقع');
    }
  };
  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <NavBar />
      <div className="container py-5" style={{ maxWidth: '900px' }}>
        <h1 className="text-center mb-4 display-5 text-primary">طلب خدمة</h1>
        <p className="text-center mb-4 text-muted lead">
          اختر الخدمة المطلوبة واملأ تفاصيل الطلب وسنقوم بالتواصل معك بأسرع وقت
          ممكن.
        </p>

        <Form>
          <div className="row g-4 mb-4">
            {SERVICES.map((service) => (
              <div className="col-md-4 shadow-lg" key={service.key}>
                <Form.Check
                  type="radio"
                  id={service.key}
                  name="serviceType"
                  value={service.key}
                  checked={formData.serviceType === service.key}
                  onChange={() => handleServiceSelect(service.key)}
                  className="d-none"
                />
                <Card
                  onClick={() => handleServiceSelect(service.key)}
                  className={`shadow-sm h-100 service-card position-relative ${
                    formData.serviceType === service.key
                      ? 'border-primary'
                      : 'border-light'
                  }`}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderWidth:
                      formData.serviceType === service.key ? '3px' : '3px',
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={service.image}
                    alt={service.title}
                  />
                  <Card.Body>
                    <Card.Title className="text-primary">
                      {service.title}
                    </Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                    {service.technicalList && (
                      <ul className="list-unstyled">
                        {service.technicalList.map((item, idx) => (
                          <li key={idx} className="text-muted">
                            - {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card.Body>
                  {formData.serviceType === service.key && (
                    <FaCheckCircle
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: '#0d6efd',
                        fontSize: '1.8rem',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                      title="محدد"
                    />
                  )}
                </Card>
              </div>
            ))}
          </div>
        </Form>

        {/* هنا تستمر فورم تفاصيل الطلب كالسابق */}
        <Form
          className="shadow-sm p-4 rounded bg-white"
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3" controlId="attachment">
            <Form.Label className="fw-bold text-secondary">المرفقات</Form.Label>
            <Form.Control
              type="file"
              name="attachment"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="details">
            <Form.Label className="fw-bold text-secondary">
              تفاصيل الطلب <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="اكتب تفاصيل الخدمة المطلوبة"
              name="serviceDetails"
              value={formData.serviceDetails}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" className="btn btn-primary px-5">
              إرسال الطلب
            </Button>
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  );
}

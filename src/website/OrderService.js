import { useState } from 'react';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import { Axios } from '../Api/axios';
import { API } from '../Api/Api';
import { UserContext, useUserContext } from '../context/UserContext';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Stack,
  TextField,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import WebIcon from '@mui/icons-material/Web';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from './components/Alertservice';

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
    icon: <WebIcon color="primary" sx={{ fontSize: 36 }} />,
  },
  {
    key: 'technical-consultation',
    title: 'استشارة تقنية',
    technicalList: ['تخطيط المشروع', 'توجيه فني'],
    description: 'نقدم لك حلولاً تقنية تساعدك في اتخاذ قرارات ذكية لمشروعك.',
    image: '../Assets/technical_consultation.jpg',
    icon: <TipsAndUpdatesIcon color="warning" sx={{ fontSize: 36 }} />,
  },
  {
    key: 'technical-support',
    title: 'دعم فني',
    technicalList: ['دعم فني', 'استكشاف الأخطاء وإصلاحها'],
    description: 'فريقنا جاهز لمساعدتك في حل المشكلات التقنية بسرعة وكفاءة.',
    image: '../Assets/technical_support.jpg',
    icon: <SupportAgentIcon color="success" sx={{ fontSize: 36 }} />,
  },
];

export default function OrderService() {
  const { currentUser } = useUserContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    mobileNumber: currentUser?.mobileNumber || '',
    serviceType: '',
    serviceDetails: '',
    attachment: null,
  });
  const [detailsError, setDetailsError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData((prevData) => ({
        ...prevData,
        attachment: files[0],
      }));
    } else if (name === 'serviceDetails') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (value.length < 100) {
        setDetailsError('يرجى كتابة تفاصيل كافية (100 حرف على الأقل)');
      } else if (value.length > 500) {
        setDetailsError('يجب ألا تتجاوز التفاصيل 500 حرف');
      } else {
        setDetailsError('');
      }
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
    if (!formData.serviceType) {
      errorAlert('يرجى اختيار نوع الخدمة');
      return;
    }
    if (formData.serviceDetails.length < 20) {
      setDetailsError('يرجى كتابة تفاصيل كافية (20 حرف على الأقل)');
      return;
    }
    if (formData.serviceDetails.length > 500) {
      setDetailsError('يجب ألا تتجاوز التفاصيل 500 حرف');
      return;
    }
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
    <Box sx={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <NavBar />
      <Box sx={{ maxWidth: 950, mx: 'auto', py: 5 }}>
        <Typography
          variant="h3"
          color="primary"
          align="center"
          fontWeight={700}
          sx={{ mb: 1, fontFamily: 'Almarai' }}
        >
          طلب خدمة
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          اختر الخدمة المطلوبة واملأ تفاصيل الطلب وسنقوم بالتواصل معك بأسرع وقت
          ممكن.
        </Typography>

        {/* اختيار الخدمة */}
        <Grid spacing={3} sx={{ mb: 3 }} gap={2} container width={'100%'}>
          {SERVICES.map((service) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={service.key}
              flexBasis={300}
              flexGrow={1}
            >
              <Card
                onClick={() => handleServiceSelect(service.key)}
                sx={{
                  cursor: 'pointer',
                  border:
                    formData.serviceType === service.key
                      ? '3px solid #1976d2'
                      : '2px solid #eee',
                  boxShadow: formData.serviceType === service.key ? 6 : 2,
                  borderRadius: 4,

                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  height: '100%',
                  '&:hover': {
                    boxShadow: 8,
                  },
                }}
                elevation={0}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {service.icon}
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {service.title}
                    </Typography>
                    {formData.serviceType === service.key && (
                      <CheckCircleIcon color="primary" sx={{ ml: 'auto' }} />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {service.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {service.technicalList &&
                      service.technicalList.map((item, idx) => (
                        <Chip
                          key={idx}
                          label={item}
                          size="small"
                          color="default"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* نموذج الطلب */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: '#fff',
            borderRadius: 4,
            boxShadow: 4,
            p: { xs: 2, md: 4 },
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Typography variant="h6" color="primary" fontWeight={700} mb={2}>
            تفاصيل الطلب
          </Typography>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AttachFileIcon color="action" />
              <Button
                variant="outlined"
                component="label"
                sx={{ borderRadius: 2, fontWeight: 'bold' }}
              >
                إرفاق ملف
                <input
                  type="file"
                  name="attachment"
                  hidden
                  onChange={handleInputChange}
                />
              </Button>
              {formData.attachment && (
                <Typography variant="body2" color="text.secondary">
                  {formData.attachment.name}
                </Typography>
              )}
            </Stack>
            <TextField
              label="تفاصيل الطلب"
              name="serviceDetails"
              value={formData.serviceDetails}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              minRows={4}
              inputProps={{ maxLength: 500 }}
              error={!!detailsError}
              helperText={
                detailsError || `${formData.serviceDetails.length} / 500 حرف`
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2, fontWeight: 'bold', mt: 2 }}
              disabled={
                !formData.serviceType ||
                !!detailsError ||
                formData.serviceDetails.length < 20
              }
            >
              إرسال الطلب
            </Button>
          </Stack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

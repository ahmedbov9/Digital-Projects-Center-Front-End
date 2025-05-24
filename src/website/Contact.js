import NavBar from './components/Navbar';
import Footer from './components/Footer';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../Api/Api';
import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from './components/Alertservice';

// MUI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    message: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'message') {
      if (value.length < 30) {
        setErrors((prev) => ({
          ...prev,
          message: 'يجب أن تكون الرسالة 30 حرفًا على الأقل',
        }));
      } else if (value.length > 250) {
        setErrors((prev) => ({
          ...prev,
          message: 'يجب ألا تتجاوز الرسالة 250 حرفًا',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          message: '',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.message.length < 30) {
      setErrors((prev) => ({
        ...prev,
        message: 'يجب أن تكون الرسالة 30 حرفًا على الأقل',
      }));
      return;
    }
    if (formData.message.length > 250) {
      setErrors((prev) => ({
        ...prev,
        message: 'يجب ألا تتجاوز الرسالة 250 حرفًا',
      }));
      return;
    }

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
      errorAlert(error?.response?.data?.message || 'حدث خطأ أثناء الإرسال');
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
        <NavBar />
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h3"
            color="primary"
            align="center"
            fontWeight={700}
            sx={{ mb: 1, fontFamily: 'Almarai' }}
          >
            تواصل معنا
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، لا تتردد في التواصل
            معنا عبر النموذج أدناه.
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            minHeight="60vh"
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: 500,
                borderRadius: 4,
                boxShadow: 6,
                background: 'linear-gradient(135deg, #fff 60%, #e3f2fd 100%)',
              }}
            >
              <CardContent>
                <Stack spacing={2} mb={2} alignItems="center">
                  <EmailIcon color="primary" sx={{ fontSize: 50 }} />
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary.main"
                  >
                    نموذج التواصل
                  </Typography>
                  <Divider sx={{ width: '100%' }} />
                </Stack>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={3}>
                    <TextField
                      label="الاسم"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                    <TextField
                      label="البريد الإلكتروني"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <EmailIcon color="primary" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                    <TextField
                      label="الرسالة"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      fullWidth
                      error={!!errors.message}
                      helperText={
                        errors.message || `${formData.message.length} / 250 حرف`
                      }
                      multiline
                      minRows={5}
                      InputProps={{
                        startAdornment: (
                          <MessageIcon
                            color="primary"
                            sx={{ alignSelf: 'flex-start' }}
                          />
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="large"
                      sx={{ fontWeight: 'bold', borderRadius: 2, mt: 1 }}
                      fullWidth
                    >
                      إرسال
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

import { useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InputAdornment from '@mui/material/InputAdornment';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
import { API } from '../../Api/Api';
import axios from 'axios';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    loadingAlert('جاري ارسال رابط تغيير كلمة المرور...');
    try {
      const apiEndPoint = `${API.forgotPassword}`;
      const data = { email };
      const response = await axios.post(apiEndPoint, data);
      if (response.status === 200) {
        closeAlert();
        successAlert('تم ارسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني');
        setResponse(null);
      } else {
        closeAlert();
        errorAlert(response.data.message);
        setResponse(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error?.response?.data?.message || 'حدث خطأ أثناء الإرسال');
      setResponse(error?.response?.data?.message);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <NavBar margin="50px" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
        sx={{ py: 6 }}
      >
        <Card
          sx={{
            width: { xs: '100%', sm: 500 },
            borderRadius: 5,
            boxShadow: 6,
            p: 2,
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.main"
              align="center"
              sx={{ mb: 1, fontFamily: 'Almarai' }}
            >
              نسيت كلمة المرور
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              {response && (
                <Alert severity="error" sx={{ mb: 2, textAlign: 'right' }}>
                  {response}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: 2, mt: 1 }}
                disabled={!email}
              >
                إرسال
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer margin="50px" />
    </Box>
  );
}

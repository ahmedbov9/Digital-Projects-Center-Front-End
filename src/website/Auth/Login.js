import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'cookie-universal';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import { API } from '../../Api/Api';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';

export default function Login() {
  const navigate = useNavigate();
  const cookies = Cookie();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      navigate('/');
      errorAlert(
        'لا يمكنك الدخول الى صفحة تسجيل الدخول سجل خروج ثم ادخل مرة اخرى'
      );
    }
  }, []);

  function changeHandler(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    loadingAlert('جاري تسجيل الدخول...');
    try {
      const response = await axios.post(API.login, form);
      if (response.status === 200) {
        successAlert('تم تسجيل الدخول بنجاح');
        closeAlert();
        cookies.set('token', response.data.token);
        navigate('/');
      } else {
        closeAlert();
        errorAlert(response.data.message);
        setResponse(response.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message === 'هذا الايميل غير مفعل بعد') {
        closeAlert();
        successAlert(error.response.data.message);
        setTimeout(() => {
          navigate('/verify', {
            state: {
              email: form.email,
              verifyType: 'resendOTP',
            },
          });
        }, 1500);
      }
      errorAlert(
        error?.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
      );
      setResponse(error?.response?.data?.message);
    }
  }

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
              تسجيل الدخول
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              مرحبًا بك! يرجى تسجيل الدخول للوصول إلى حسابك.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={form.email}
                onChange={changeHandler}
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
              <TextField
                label="كلمة المرور"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={changeHandler}
                required
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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
                disabled={!form.email || !form.password}
              >
                تسجيل الدخول
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography align="center" color="text.secondary">
              <Link
                to="/forget-password"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                هل نسيت كلمة المرور؟
              </Link>
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
              ليس لديك حساب؟{' '}
              <Link
                to="/register"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                تسجيل حساب جديد
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Footer margin="50px" />
    </Box>
  );
}

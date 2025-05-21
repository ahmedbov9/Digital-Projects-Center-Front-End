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
  Stack,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import { API } from '../../Api/Api';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';

export default function Register() {
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const cookies = Cookie();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Password validation states
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      navigate('/');
      errorAlert(
        'لا يمكنك الدخول الى صفحة تسجيل الدخول سجل خروج ثم ادخل مرة اخرى'
      );
    }
    // eslint-disable-next-line
  }, []);

  // Real-time validation
  function changeHandler(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      if (value.length < 8) {
        setPasswordError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      } else if (!/[A-Z]/.test(value)) {
        setPasswordError(
          'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل'
        );
      } else if (!/[a-z]/.test(value)) {
        setPasswordError(
          'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل'
        );
      } else if (!/[0-9]/.test(value)) {
        setPasswordError('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل');
      } else if (!/[^A-Za-z0-9]/.test(value)) {
        setPasswordError('يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل');
      } else {
        setPasswordError('');
      }
      // Confirm password check
      if (form.confirmPassword && value !== form.confirmPassword) {
        setConfirmPasswordError('كلمتا المرور غير متطابقتين');
      } else {
        setConfirmPasswordError('');
      }
    }
    if (name === 'confirmPassword') {
      if (value !== form.password) {
        setConfirmPasswordError('كلمتا المرور غير متطابقتين');
      } else {
        setConfirmPasswordError('');
      }
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    // Final validation before submit
    if (passwordError || confirmPasswordError) {
      errorAlert('يرجى تصحيح أخطاء كلمة المرور');
      return;
    }
    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      errorAlert('كلمة المرور لا تحقق الشروط المطلوبة');
      return;
    }
    if (form.password !== form.confirmPassword) {
      errorAlert('كلمتا المرور غير متطابقتين');
      return;
    }
    loadingAlert('جاري تسجيل الحساب...');
    try {
      const response = await axios.post(`${API.registerStepOne}`, form);
      if (response.status === 200) {
        setResponse(response.status);
        closeAlert();
        successAlert(response.data.message);
        navigate('/verify', {
          state: {
            email: form.email,
            verifyType: 'register',
          },
        });
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response.data.message);
    }
  }

  return (
    <Box sx={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <NavBar margin="100px" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
        sx={{ py: 6 }}
      >
        <Card
          sx={{
            width: { xs: '100%', sm: 600, md: 700 },

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
              تسجيل حساب جديد
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              مرحبًا بك! يرجى إنشاء حساب جديد للانضمام إلينا.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={submitHandler} noValidate>
              <Grid container direction={'column'} spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="الاسم الأول"
                    name="firstName"
                    value={form.firstName}
                    onChange={changeHandler}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="اسم العائلة"
                    name="lastName"
                    value={form.lastName}
                    onChange={changeHandler}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={changeHandler}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="رقم الهاتف"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={changeHandler}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="كلمة المرور"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={changeHandler}
                    required
                    fullWidth
                    error={!!passwordError}
                    helperText={
                      passwordError ||
                      'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير وصغير، رقم، ورمز خاص'
                    }
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="تأكيد كلمة المرور"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={changeHandler}
                    required
                    fullWidth
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm((show) => !show)}
                            edge="end"
                            tabIndex={-1}
                          >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              {response === 201 ? (
                <Alert severity="success" sx={{ mt: 2, textAlign: 'right' }}>
                  تم تسجيل حسابك بنجاح!
                </Alert>
              ) : response ? (
                <Alert severity="error" sx={{ mt: 2, textAlign: 'right' }}>
                  {typeof response === 'object' ? response.message : response}
                </Alert>
              ) : null}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: 2, mt: 3 }}
                disabled={
                  !!passwordError ||
                  !!confirmPasswordError ||
                  !form.firstName ||
                  !form.lastName ||
                  !form.email ||
                  !form.mobileNumber ||
                  !form.password ||
                  !form.confirmPassword
                }
              >
                تسجيل حساب جديد
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography align="center" color="text.secondary">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/login"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                تسجيل الدخول
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Footer margin={'150px'} />
    </Box>
  );
}

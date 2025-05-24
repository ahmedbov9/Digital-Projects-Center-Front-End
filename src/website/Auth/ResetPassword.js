import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  closeAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../components/Alertservice';
import axios from 'axios';
import { API } from '../../Api/Api';

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
    token: token,
    id: id,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [response, setResponse] = useState(null);

  const handleInputChange = (e) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    loadingAlert('جاري تغيير كلمة المرور...');
    try {
      const response = await axios.patch(`${API.resetPassword}`, form);
      if (response.status === 200) {
        closeAlert();
        successAlert(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(
        error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور'
      );
      setResponse(error.response?.data?.message);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <NavBar />
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
              تغيير كلمة المرور
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              أدخل كلمة المرور الجديدة وأكدها
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="كلمة المرور الجديدة"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange}
                required
                fullWidth
                sx={{ mb: 2 }}
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
              <TextField
                label="تأكيد كلمة المرور الجديدة"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
                sx={{ mb: 2 }}
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
                disabled={
                  !!passwordError ||
                  !!confirmPasswordError ||
                  !form.password ||
                  !form.confirmPassword
                }
              >
                تغيير كلمة المرور
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
}

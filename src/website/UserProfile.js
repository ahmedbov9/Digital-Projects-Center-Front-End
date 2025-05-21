import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Cookie from 'cookie-universal';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import { API } from '../Api/Api';
import { Axios } from '../Api/axios';
import { UserContext } from '../context/UserContext';
import { getDateDistance } from '../helper/DateDistancs';
import {
  confirmAlert,
  confirmWhenWrite,
  errorAlert,
} from './components/Alertservice';

// MUI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Button as MUIButton,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';

export default function UserProfile() {
  const cookie = Cookie();
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return (
      <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <NavBar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </Box>
        <Footer />
      </Box>
    );
  }

  const handleLogout = async () => {
    const confirmed = await confirmAlert({
      message: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      title: 'تأكيد',
      icon: 'warning',
    });
    if (!confirmed) return;

    cookie.remove('token');
    window.location.pathname = '/';
  };

  const handleDeleteAccount = async () => {
    const email = await confirmWhenWrite({
      title: 'تأكيد الحذف',
      message: 'يرجى كتابة بريدك الإلكتروني لتأكيد حذف الحساب.',
      inputLabel: 'البريد الإلكتروني',
      inputPlaceholder: 'البريد الإلكتروني',
    });
    if (!email) return;

    const confirmed = await confirmAlert({
      message: 'هل أنت متأكد أنك تريد حذف حسابك؟',
      title: 'تأكيد',
      icon: 'danger',
    });
    if (!confirmed) return;

    try {
      const response = await Axios.delete(
        `${API.deleteAccount}/${currentUser._id}`,
        { data: { email } }
      );
      if (response.status === 200) {
        cookie.remove('token');
        window.location.pathname = '/';
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      errorAlert(error?.response?.data?.message || 'حدث خطأ أثناء الحذف');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <NavBar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ py: 6 }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: 5,
            boxShadow: 6,
            p: 2,
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
          }}
        >
          <CardContent>
            <Stack alignItems="center" spacing={2} mb={3}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 80,
                  height: 80,
                  fontSize: 40,
                }}
              >
                <PersonIcon fontSize="inherit" />
              </Avatar>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                الملف الشخصي
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                مرحبًا {currentUser.firstName}! إليك تفاصيل حسابك.
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2} mb={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    الاسم
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {currentUser.firstName} {currentUser.lastName}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'info.light', width: 40, height: 40 }}>
                  <EmailIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    البريد الإلكتروني
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {currentUser.email}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: 'success.light', width: 40, height: 40 }}
                >
                  <PhoneIphoneIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    رقم الجوال
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {currentUser.mobileNumber}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}
                >
                  <CalendarMonthIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    تاريخ التسجيل
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {getDateDistance(currentUser.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 1 }}
            >
              <MUIButton
                component={Link}
                to={`/edit-profile/${currentUser._id}`}
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<EditIcon />}
                sx={{ fontWeight: 'bold', borderRadius: 2, gap: 1 }}
              >
                تعديل الملف الشخصي
              </MUIButton>
              <MUIButton
                component={Link}
                to="/change-password"
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<LockResetIcon />}
                sx={{ fontWeight: 'bold', borderRadius: 2, gap: 1 }}
              >
                تغيير كلمة المرور
              </MUIButton>
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <MUIButton
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                sx={{ fontWeight: 'bold', borderRadius: 2, gap: 1 }}
                onClick={handleDeleteAccount}
              >
                حذف الحساب
              </MUIButton>
              <MUIButton
                variant="contained"
                color="inherit"
                fullWidth
                startIcon={<LogoutIcon />}
                sx={{ fontWeight: 'bold', borderRadius: 2, gap: 1 }}
                onClick={handleLogout}
              >
                تسجيل الخروج
              </MUIButton>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
}

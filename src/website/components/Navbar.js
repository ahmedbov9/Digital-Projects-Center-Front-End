import { Link } from 'react-router-dom';
import Cookie from 'cookie-universal';
import { useContext } from 'react';
import { WindowContext } from '../../context/WindowContext';
import AnchorTemporaryDrawer from './AnchorTemporaryDrawer';
import { UserContext } from '../../context/UserContext';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function NavBar(props) {
  const cookies = Cookie();
  const token = cookies.get('token');
  const margin = props.margin || '0px';
  const windowWidth = useContext(WindowContext).width;
  const { currentUser } = useContext(UserContext);
  const isAdmin = currentUser?.isAdmin || false;

  if (windowWidth <= 768) {
    return (
      <AppBar position="static" color="primary" sx={{ mb: margin }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <AnchorTemporaryDrawer />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={6}
      sx={{
        background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
        mb: margin,
        py: 0.5,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ justifyContent: 'center', gap: 1, direction: 'ltr' }}
        >
          <Button
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 20,
              mx: 1,
              '&:hover': { color: '#e3f2fd', background: 'transparent' },
            }}
          >
            الرئيسية
          </Button>
          <Button
            component={Link}
            to="/order-service"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 20,
              mx: 1,
              '&:hover': { color: '#e3f2fd', background: 'transparent' },
            }}
          >
            طلب خدمة
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 20,
              mx: 1,
              '&:hover': { color: '#e3f2fd', background: 'transparent' },
            }}
          >
            تواصل معنا
          </Button>
          {token && (
            <>
              <Button
                component={Link}
                to="/my-orders"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 20,
                  mx: 1,
                  '&:hover': { color: '#e3f2fd', background: 'transparent' },
                }}
              >
                طلباتي
              </Button>
              <Button
                component={Link}
                to="/user-profile"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 20,
                  mx: 1,
                  '&:hover': { color: '#e3f2fd', background: 'transparent' },
                }}
              >
                الملف الشخصي
              </Button>
            </>
          )}
          {!token && (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 20,
                mx: 1,
                '&:hover': { color: '#e3f2fd', background: 'transparent' },
              }}
            >
              تسجيل الدخول
            </Button>
          )}
          {isAdmin && (
            <Button
              component={Link}
              to="/dashboard"
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 20,
                mx: 1,
                '&:hover': { color: '#e3f2fd', background: 'transparent' },
              }}
            >
              لوحة التحكم
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

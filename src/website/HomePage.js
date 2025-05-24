import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  useTheme,
} from '@mui/material';
import WebIcon from '@mui/icons-material/LaptopMac';
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export default function HomePage() {
  const theme = useTheme();

  const services = [
    {
      icon: (
        <WebIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
      ),
      title: 'تطوير مواقع الويب',
      desc: 'تصميم وتطوير مواقع ويب احترافية تلبي احتياجاتك بأحدث التقنيات.',
    },
    {
      icon: (
        <SchoolIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
      ),
      title: 'مشاريع التخرج',
      desc: 'تنفيذ مشاريع تخرج مبتكرة ومميزة بجودة عالية وإبداع.',
    },
    {
      icon: (
        <TipsAndUpdatesIcon
          sx={{ fontSize: 48, color: theme.palette.primary.main }}
        />
      ),
      title: 'استشارات تقنية',
      desc: 'تقديم استشارات تقنية لمساعدتك في تحقيق أهدافك وتطوير أعمالك.',
    },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e0e3e5 60%, #f8fafc 100%)',
        minHeight: '100vh',
      }}
    >
      <Navbar />

      <Box
        sx={{
          background: 'linear-gradient(120deg, #1976d2 60%, #1565c0 100%)',
          color: '#fff',
          py: { xs: 7, md: 10 },
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mb: 2, fontFamily: 'Almarai' }}
          >
            مرحباً بك في مركز المشاريع الرقمية
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 3, color: 'rgba(255,255,255,0.9)' }}
          >
            خدمات تطوير مواقع الويب والمشاريع الاحترافية بجودة عالية وابتكار.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="primary"
            sx={{ mb: 1, fontFamily: 'Almarai' }}
          >
            خدماتنا
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            نقدم مجموعة متنوعة من الخدمات التقنية لتلبية جميع احتياجاتك الرقمية.
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          direction="row"
        >
          {services.map((service, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={idx}
              sx={{ minWidth: 320, display: 'flex' }}
            >
              <Card
                elevation={6}
                sx={{
                  borderRadius: 5,
                  p: 2,
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #fff 70%, #e3f2fd 100%)',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.04)',
                    boxShadow: 10,
                  },
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 320,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    width: 80,
                    height: 80,
                    mb: 2,
                    boxShadow: 3,
                  }}
                  variant="rounded"
                >
                  {service.icon}
                </Avatar>
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary"
                    sx={{ mb: 1 }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: 18 }}
                  >
                    {service.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
          color: '#fff',
          py: { xs: 5, md: 7 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            جاهز للبدء بمشروعك القادم؟
          </Typography>

          <Button
            href="/order-service"
            variant="contained"
            size="large"
            sx={{
              fontWeight: 'bold',
              fontSize: 20,
              px: 6,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
              boxShadow: 4,
              '&:hover': {
                background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
              },
            }}
          >
            اطلب خدمتك الآن
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

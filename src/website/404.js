import { Button, Container, Row, Col } from 'react-bootstrap';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: '#e0e3e5' }}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #e0e3e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Almarai, sans-serif',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 5,
                  boxShadow: 6,
                  p: { xs: 3, md: 6 },
                  textAlign: 'center',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 12,
                  },
                }}
              >
                <ErrorOutlineIcon
                  sx={{ fontSize: 100, color: '#dc3545', mb: 2 }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  color="error"
                  gutterBottom
                  sx={{ fontWeight: 'bold', letterSpacing: 2 }}
                >
                  404
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  الصفحة غير موجودة
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, fontSize: 18 }}
                >
                  عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.
                  <br />
                  تأكد من صحة الرابط أو عد للصفحة الرئيسية.
                </Typography>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/')}
                  style={{
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    padding: '10px 40px',
                    fontSize: '1.2rem',
                    borderRadius: '30px',
                    boxShadow: '0 4px 16px rgba(220,53,69,0.08)',
                  }}
                >
                  العودة إلى الصفحة الرئيسية
                </Button>
              </Box>
            </Col>
          </Row>
        </Container>
      </Box>
    </div>
  );
}

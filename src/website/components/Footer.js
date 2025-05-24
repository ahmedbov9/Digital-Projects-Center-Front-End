import { Box, Container, IconButton, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';

export default function Footer(props) {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
        color: '#fff',
        py: 3,
        mt: props.margin || 0,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontFamily: 'Almarai',
            mb: { xs: 2, md: 0 },
          }}
        >
          جميع الحقوق محفوظة &copy; 2025 مركز المشاريع الرقمية
        </Typography>
        <Box>
          <IconButton
            href="https://github.com/ahmedbov9"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#fff', mx: 1 }}
          >
            <FontAwesomeIcon icon={faGithub} fontSize={22} />
          </IconButton>
          <IconButton
            href="https://wa.me/+966565125040"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#fff', mx: 1 }}
          >
            <FontAwesomeIcon icon={faWhatsapp} fontSize={22} />
          </IconButton>
          <IconButton
            href="mailto:companybov9@gmail.com"
            sx={{ color: '#fff', mx: 1 }}
          >
            <FontAwesomeIcon icon={faMailBulk} fontSize={22} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

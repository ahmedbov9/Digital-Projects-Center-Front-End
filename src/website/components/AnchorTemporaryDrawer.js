import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { Fragment, useState } from 'react';
import Cookie from 'cookie-universal';
import { useNavigate } from 'react-router-dom';
export default function AnchorTemporaryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const cookies = Cookie();
  const isLoggedIn = cookies.get('token') ? true : false;
  const navigate = useNavigate();
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };
  const fullListItems = [
    { text: 'الرئيسية', icon: <HomeIcon />, path: '/' },
    { text: 'طلب خدمة', icon: <BuildIcon />, path: '/order-service' },
    { text: 'تواصل معنا', icon: <ContactMailIcon />, path: '/contact' },
    { text: 'طلباتي', icon: <AssignmentIcon />, path: '/my-orders' },
    { text: 'الملف الشخصي', icon: <PersonIcon />, path: '/user-profile' },
  ];
  const displayListItems = isLoggedIn
    ? fullListItems
    : fullListItems.slice(0, 3);

  const list = () => (
    <Box
      sx={{ width: 'auto' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {displayListItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Fragment>
      <MenuOpenIcon
        onClick={toggleDrawer(true)}
        sx={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          fontSize: '70px',
          color: 'white',
          position: 'fixed',
          cursor: 'pointer',
          border: '2px solid white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        }}
        className="bg-primary rounded-circle p-2"
      />
      <Drawer anchor="bottom" open={isOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Fragment>
  );
}

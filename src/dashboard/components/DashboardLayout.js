import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  useTheme,
  styled,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const location = useLocation();

  const drawerWidth = 240;

  const navItems = [
    { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'الطلبات', icon: <ShoppingCartIcon />, path: '/dashboard/orders' },
    {
      text: 'المستخدمين',
      icon: <GroupIcon />,
      subItems: [
        { text: 'نشطين', path: '/dashboard/users' },
        { text: 'غير نشطين', path: '/dashboard/unverified-users' },
      ],
    },
  ];

  const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary,
    width: '100%',
    display: 'flex',
  }));

  const handleToggleSubMenu = (menu) => {
    if (menu === 'المستخدمين') {
      setUsersOpen((prev) => !prev);
      setAnalyticsOpen(false);
    } else if (menu === 'التحليلات') {
      setAnalyticsOpen((prev) => !prev);
      setUsersOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, justifyContent: 'space-between' }}>
        <Typography variant="h5" fontFamily={'Almarai'}>
          لوحة التحكم
        </Typography>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ text, icon, path, subItems }) => {
          if (subItems) {
            const isOpen = text === 'المستخدمين' ? usersOpen : analyticsOpen;
            return (
              <React.Fragment key={text}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleToggleSubMenu(text)}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: '20px',
                        fontFamily: 'Almarai',
                      }}
                    />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subItems.map(({ text: subText, path: subPath }) => (
                      <ListItem key={subText} disablePadding sx={{ pl: 4 }}>
                        <ListItemButton
                          component={StyledLink}
                          to={subPath}
                          selected={location.pathname === subPath}
                          onClick={toggleDrawer}
                        >
                          <ListItemText
                            primary={subText}
                            primaryTypographyProps={{
                              fontFamily: 'Almarai',
                              fontSize: '16px',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={StyledLink}
                to={path}
                selected={location.pathname === path}
                onClick={toggleDrawer}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: '20px',
                    fontFamily: 'Almarai',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ position: 'absolute', right: '50px' }}
          >
            <MenuIcon sx={{ fontSize: '40px' }} />
          </IconButton>

          <Typography
            variant="h5"
            noWrap
            sx={{
              margin: '0 auto',
              fontFamily: 'Almarai',
              fontWeight: 'bold',
            }}
          >
            نظام الإدارة
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

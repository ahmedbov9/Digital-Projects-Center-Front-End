import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardLayout from './components/DashboardLayout';
import { API } from '../Api/Api';
import { Axios } from '../Api/axios';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FormatNumber } from '../helper/FormatNumber';
export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [orderStatus, setOrderStatus] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(API.dashboardStats);
        setTotalEarnings(response.data.totalEarnings);
        setTotalUsers(response.data.totalUsers);
        setTotalOrders(response.data.totalOrders);
        setOrderStatus({
          pending: response.data.totalPendingOrders,
          canceled: response.data.totalCancelledOrders,
          inProgress: response.data.totalInProgressOrders,
          waitForPay: response.data.totalWaitForPayOrders,
          completed: response.data.totalCompletedOrders,
          rejectedByUser: response.data.totalRejectedByUserOrders,
          totalLoses: response.data.totalLossesByRejectedOrders,
          waitForApproval: response.data.totalWaitForApprovalOrders,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const mainStats = [
    {
      label: 'إجمالي المستخدمين',
      value: FormatNumber(totalUsers),
      icon: <PeopleIcon fontSize="large" />,
      color: '#4caf50',
    },
    {
      label: 'إجمالي الطلبات',
      value: FormatNumber(totalOrders),
      icon: <ShoppingCartIcon fontSize="large" />,
      color: '#2196f3',
    },
    {
      label: 'إجمالي الأرباح',
      value: FormatNumber(totalEarnings),
      icon: <MonetizationOnIcon fontSize="large" />,
      color: '#ff9800',
      isCurrency: true,
    },
    {
      label: 'إجمالي الخسائر بسبب الطلبات المرفوضة',
      value: FormatNumber(orderStatus.totalLoses),
      icon: <MonetizationOnIcon fontSize="large" />,
      color: '#f44336',
      isCurrency: true,
    },
  ];

  const orderStats = [
    {
      label: 'الطلبات المعلقة',
      value: FormatNumber(orderStatus.pending),
      color: '#ff9800',
    },
    {
      label: 'في انتظار الموافقة العميل',
      value: FormatNumber(orderStatus.waitForApproval),
      color: '#ff9800',
    },
    {
      label: 'الطلبات الملغية',
      value: FormatNumber(orderStatus.canceled),
      color: '#f44336',
    },
    {
      label: 'قيد التنفيذ',
      value: FormatNumber(orderStatus.inProgress),
      color: '#2196f3',
    },
    {
      label: 'في انتظار الدفع',
      value: FormatNumber(orderStatus.waitForPay),
      color: '#ff9800',
    },
    {
      label: 'المكتملة',
      value: FormatNumber(orderStatus.completed),
      color: '#4caf50',
    },
    {
      label: 'المرفوضة من قبل المستخدم',
      value: FormatNumber(orderStatus.rejectedByUser),
      color: '#f44336',
    },
  ];

  const renderCard = ({ label, value, icon, color, isCurrency = false }) => (
    <Grid item xs={12} sm={6} md={4} key={label}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          transition: '0.3s',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: color,
                width: 56,
                height: 56,
                boxShadow: 2,
              }}
            >
              {icon || <PendingActionsIcon />}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontFamily="Almarai"
              >
                {label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {isCurrency ? (
                  <Box display="flex" alignItems="center">
                    {value}
                    <img
                      src={'../Assets/Saudi_Riyal_Symbol.svg.webp'}
                      alt="ريال"
                      style={{ width: 24, marginRight: 6 }}
                    />
                  </Box>
                ) : (
                  value
                )}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f3f6f9', py: 6, px: 3 }}>
      <DashboardLayout>
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          mb={4}
          fontFamily="Almarai"
          className="bg-primary text-white p-2 rounded"
        >
          لوحة التحكم الرئيسية
        </Typography>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          className={'col-lg-8 col-md-12 col-sm-6 mx-auto'}
          mb={6}
        >
          {mainStats.map(renderCard)}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          mb={4}
          fontFamily="Almarai"
          className="bg-primary text-white p-2 rounded"
        >
          حالة الطلبات
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {orderStats.map((item) =>
            renderCard({ ...item, icon: <PendingActionsIcon /> })
          )}
        </Grid>
        <Outlet />
      </DashboardLayout>
    </Box>
  );
}

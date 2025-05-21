import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Grid,
  Chip,
  Avatar,
  useTheme,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Axios } from '../../Api/axios';
import { API } from '../../Api/Api';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import { FormatNumber } from '../../helper/FormatNumber';
import {
  closeAlert,
  confirmAlert,
  confirmWhenWrite,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../../website/components/Alertservice';
import DashboardLayout from './DashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import RejectOfferModal from '../../website/components/RejectOfferModel';
export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const statusMap = {
    pending: { label: 'قيد الانتظار', color: 'warning' },
    'wait-for-approval': {
      label: 'بانتظار الموافقة',
      color: 'warning',
    },
    approved: { label: 'تمت الموافقة', color: 'info' },
    rejected: { label: 'مرفوض', color: 'error' },
    completed: { label: 'مكتمل', color: 'success' },
    unpaid: { label: 'غير مدفوع', color: 'error' },
    paid: { label: 'مدفوع', color: 'success' },
  };
  const handleSendOffer = async () => {
    const priceOffer = await confirmWhenWrite({
      title: 'إرسال عرض سعري',
      message: 'يرجى كتابة السعر المقترح.',
      inputLabel: 'السعر المقترح',
      inputPlaceholder: 'السعر المقترح',
      inputPlaceholder2: 'تاريخ التسليم المتوقع',
      cancelButtonText: 'إلغاء',
      confirmButtonText: 'إرسال',
    });
    if (!priceOffer) return;
    const deleveryDate = await confirmWhenWrite({
      title: 'تاريخ التسليم',
      message: 'يرجى كتابة تاريخ التسليم المتوقع.',
      inputLabel: 'تاريخ التسليم المتوقع',
      inputPlaceholder: 'تاريخ التسليم المتوقع',
      type: 'date',
      cancelButtonText: 'إلغاء',
      confirmButtonText: 'إرسال',
    });
    console.log(priceOffer, deleveryDate);
    if (!deleveryDate) return;

    const confirmed = await confirmAlert({
      title: 'تأكيد الإرسال',
      message: `هل أنت متأكد أنك تريد إرسال عرض سعري بقيمة ${FormatNumber(
        priceOffer
      )} ريال؟ وتاريخ التسليم المتوقع هو ${formatDistanceToNow(deleveryDate, {
        locale: ar,
        addSuffix: true,
        includeSeconds: true,
      })}`,

      cancelButtonText: 'إلغاء',
      confirmButtonText: 'إرسال',
    });
    if (!confirmed) return;
    try {
      const response = await Axios.post(API.sendPriceOffer, {
        id: id,
        price: priceOffer,
        serviceDeleveryDate: deleveryDate,
      });
      if (response.status === 200) {
        successAlert(response.data.message);
        window.location.reload();
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      errorAlert(error.response.data.message);
    }
  };

  const handleRejectOrder = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async (rejectReason) => {
    setShowRejectModal(false);
    loadingAlert('جاري رفض الطلب...');
    try {
      const response = await Axios.post(API.rejectOrder, {
        id,
        rejectReason,
      });
      if (response.status === 200) {
        closeAlert();
        setShowRejectModal(false);
        successAlert(response.data.message);
        window.location.reload();
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      errorAlert(error.response.data.message);
    }
  };
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await Axios.get(`${API.getOrderById}/${id}`);
        setOrder(response.data);
      } catch (error) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const handleChangeStatusToPaid = async () => {
    const confirmed = await confirmAlert({
      title: 'تأكيد الدفع',
      message: 'هل أنت متأكد أنك تريد تغيير حالة الدفع إلى مدفوع؟',
      cancelButtonText: 'إلغاء',
      confirmButtonText: 'تأكيد',
    });
    if (!confirmed) return;
    loadingAlert('جاري تغيير حالة الدفع...');
    try {
      const response = await Axios.post(API.updatePaymentStatusToPaid, {
        id,
      });
      if (response.status === 200) {
        closeAlert();
        successAlert(response.data.message);
        window.location.reload();
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response.data.message);
    }
  };

  const handleChangeStatusToCompleted = async () => {
    const confirmed = await confirmAlert({
      title: 'تأكيد إكمال الطلب',
      message: 'هل أنت متأكد أنك تريد تغيير حالة الطلب إلى مكتمل؟',
      cancelButtonText: 'إلغاء',
      confirmButtonText: 'تأكيد',
    });
    if (!confirmed) return;
    loadingAlert('جاري تغيير حالة الطلب...');
    try {
      const response = await Axios.post(API.updateOrderStatusToCompleted, {
        id,
      });
      if (response.status === 200) {
        closeAlert();
        successAlert(response.data.message);
        window.location.reload();
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response.data.message);
    }
  };

  if (!order) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error" variant="h6">
          تعذر تحميل تفاصيل الطلب.
        </Typography>
      </Box>
    );
  }
  const updateOrderStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'جاري المعالجة';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'wait-for-approval':
        return 'بانتظار الموافقة';
      case 'wait-for-pay':
        return 'بانتظار الدفع';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };
  const updateOrderPriceOfferStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'accepted':
        return 'تم قبول العرض';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'غير معروف';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#e0e3e5',
        minHeight: '100vh',
        paddingTop: '100px',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Card
          sx={{
            maxWidth: 700,
            width: '100%',
            mx: 2,
            boxShadow: 6,
            borderRadius: 4,
            background: theme.palette.background.paper,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary.main"
              gutterBottom
              textAlign="center"
              fontFamily="Almarai"
            >
              تفاصيل الطلب
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3} direction={'column'} gap={4}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      اسم العميل
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.userId?.firstName} {order.userId?.lastName}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                    <EmailIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      البريد الإلكتروني
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.userId?.email || 'غير متوفر'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                    <PhoneIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      رقم الهاتف
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.userId?.mobileNumber ||
                        order.userId?.phone ||
                        'غير متوفر'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                    <CalendarMonthIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      تاريخ انشاء الطلب
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDistanceToNow(order.createdAt, {
                        locale: ar,
                        addSuffix: true,
                        includeSeconds: true,
                      }) || 'غير متوفر'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                    <DescriptionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      رقم الطلب
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.orderNumber}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                    <AssignmentTurnedInIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      نوع الخدمة
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.serviceType === 'web-development'
                        ? 'تطوير ويب'
                        : order.serviceType === 'technical-consultation'
                        ? 'استشارة تقنية'
                        : 'دعم فني'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={2}
                  gap={1}
                >
                  <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                    <DescriptionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      تفاصيل الخدمة
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        wordBreak: 'break-word',
                        color: 'text.secondary',
                        lineHeight: 2,
                        fontSize: 16,
                        background: theme.palette.background.default,
                        borderRadius: 2,
                        p: 2,
                        mt: 1,
                        boxShadow: 0,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {order.serviceDetails}
                    </Typography>
                  </Box>
                </Stack>
                {order.serviceDeleveryDate && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                      <CalendarMonthIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        تاريخ التسليم المتوقع
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          lineHeight: 2,
                          fontSize: 16,
                          borderRadius: 2,
                          p: 2,
                          mt: 1,
                          boxShadow: 0,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {order.serviceDeleveryDate
                          ? formatDistanceToNow(order.serviceDeleveryDate, {
                              locale: ar,
                              addSuffix: true,
                              includeSeconds: true,
                            })
                          : '-'}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                    <AttachFileIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      المرفق
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.attachment || 'لا يوجد مرفق'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.info.dark }}>
                    <AssignmentTurnedInIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      حالة الخدمة
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {updateOrderStatus(order.serviceStatus)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                    <MonetizationOnIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      حالة الدفع
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {statusMap[order.servicePaymentStatus]?.label ||
                        order.servicePaymentStatus}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              {order.priceOffer && (
                <Grid item xs={12} sm={6}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                      <MonetizationOnIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        السعر المقترح
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {FormatNumber(order.priceOffer.price)} ريال
                      </Typography>
                      {order.priceOffer.status && (
                        <Chip
                          label={
                            statusMap[order.priceOffer.status]?.label ||
                            updateOrderPriceOfferStatus(order.priceOffer.status)
                          }
                          color={
                            statusMap[order.priceOffer.status]?.color ||
                            'default'
                          }
                          size="small"
                          sx={{ ml: 1, fontWeight: 600 }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Grid>
              )}
              {order.priceOffer.rejectReason && (
                <Grid item xs={12} sm={6}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        سبب رفض العرض
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          wordBreak: 'break-word',
                          color: 'text.secondary',
                          lineHeight: 2,
                          fontSize: 16,
                          background: theme.palette.background.default,
                          borderRadius: 2,
                          p: 2,
                          mt: 1,
                          boxShadow: 0,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {order.priceOffer.rejectReason}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {order.priceOffer.responseAt && (
                <Grid item xs={12} sm={6}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        تاريخ رد العميل
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          wordBreak: 'break-word',
                          color: 'text.secondary',
                          lineHeight: 2,
                          fontSize: 16,
                          background: theme.palette.background.default,
                          borderRadius: 2,
                          p: 2,
                          mt: 1,
                          boxShadow: 0,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {formatDistanceToNow(order.priceOffer.responseAt, {
                          locale: ar,
                          addSuffix: true,
                          includeSeconds: true,
                        }) || 'غير متوفر'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {order.servicePaymentStatus === 'unpaid' && (
                <Grid item xs={12} sm={6}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        حاله الدفع
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          wordBreak: 'break-word',
                          color: 'text.secondary',
                          lineHeight: 2,
                          fontSize: 16,
                          background: theme.palette.background.default,
                          borderRadius: 2,
                          p: 2,
                          mt: 1,
                          boxShadow: 0,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Button onClick={handleChangeStatusToPaid}>
                          تحديث حالة الدفع مدفوع
                        </Button>
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {order.serviceStatus === 'in-progress' && (
                <Grid item xs={12} sm={6}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                      <AssignmentTurnedInIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        تحديث حالة الطلب
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          wordBreak: 'break-word',
                          color: 'text.secondary',
                          lineHeight: 2,
                          fontSize: 16,
                          background: theme.palette.background.default,
                          borderRadius: 2,
                          p: 2,
                          mt: 1,
                          boxShadow: 0,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Button onClick={handleChangeStatusToCompleted}>
                          تحديث حالة الطلب الى مكتمل
                        </Button>
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Grid>
            {order.serviceStatus === 'pending' &&
              order.priceOffer.price === 0 && (
                <>
                  <Box mt={3} display="flex" justifyContent={'center'} gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSendOffer(order._id)}
                      startIcon={<SendIcon />}
                      sx={{ gap: 1.5 }}
                    >
                      إرسال عرض سعري
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRejectOrder(order._id)}
                      startIcon={<CancelIcon />}
                      sx={{ gap: 1.5 }}
                    >
                      إلغاء الطلب
                    </Button>
                  </Box>
                </>
              )}
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Chip
                label={
                  statusMap[order.serviceStatus]?.label ||
                  updateOrderStatus(order.serviceStatus) ||
                  'غير معروف'
                }
                color={statusMap[order.serviceStatus]?.color || 'default'}
                icon={<AssignmentTurnedInIcon />}
                sx={{ fontWeight: 600, fontSize: 16 }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <RejectOfferModal
        open={showRejectModal}
        onClose={() => {
          console.log(showRejectModal);
          setShowRejectModal(false);
        }}
        onSubmit={confirmReject}
      />
      <DashboardLayout />
    </div>
  );
}

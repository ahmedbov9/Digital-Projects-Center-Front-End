import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import NavBar from './Navbar';
import Footer from './Footer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { getDateDistance } from '../../helper/DateDistancs';
import { Button } from 'react-bootstrap';
import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from './Alertservice';
import { Axios } from '../../Api/axios';
import { API } from '../../Api/Api';
import PaidIcon from '@mui/icons-material/Paid';
import RejectOfferModal from './RejectOfferModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';
import TodayIcon from '@mui/icons-material/Today';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { FormatNumber } from '../../helper/FormatNumber';
import { formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  const [showRejectModal, setShowRejectModal] = useState(false);

  const orderStatus = [
    { status: 'pending', color: 'warning' },
    { status: 'in-progress', color: 'info' },
    { status: 'wait-for-pay', color: 'danger' },
    { status: 'wait-for-approval', color: 'danger' },
    { status: 'completed', color: 'success' },
    { status: 'cancelled', color: 'danger' },
  ];

  const getStatusColor = (status) => {
    const statusObj = orderStatus.find((s) => s.status === status);
    return statusObj ? statusObj.color : 'secondary';
  };

  const handleAcceptOffer = async () => {
    const confirm = await confirmAlert({
      title: 'تأكيد',
      message: 'هل أنت متأكد أنك تريد قبول العرض؟',
      icon: 'warning',
    });
    if (!confirm) return;

    loadingAlert('جاري قبول العرض...');
    try {
      const response = await Axios.post(API.acceptOffer, { id });
      closeAlert();
      if (response.status === 200) {
        successAlert(response.data.message);
        setTimeout(() => (window.location.pathname = '/my-orders'), 1000);
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response?.data?.message || 'حدث خطأ ما');
    }
  };

  const handleRejectOffer = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async (rejectReason) => {
    loadingAlert('جاري رفض العرض...');
    try {
      const response = await Axios.post(API.rejectOffer, {
        id,
        rejectReason,
      });
      closeAlert();
      setShowRejectModal(false);
      if (response.status === 200) {
        successAlert(response.data.message);
        setTimeout(() => (window.location.pathname = '/my-orders'), 1000);
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      closeAlert();
      errorAlert(error.response?.data?.message || 'حدث خطأ ما');
    }
  };

  if (!order) return <div>لا توجد بيانات لهذا الطلب.</div>;

  const updateOrderStatusCases = () => {
    switch (order.serviceStatus) {
      case 'pending':
        return 'جاري المعالجة';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'wait-for-approval':
        return 'في انتظار موافقتك';
      case 'wait-for-pay':
        return 'انتظار الدفع';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#e0e3e5' }}>
      <NavBar margin="100px" />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <Card
          sx={{
            maxWidth: 800,
            width: '100%',
            mx: 2,
            boxShadow: 6,
            borderRadius: 4,
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
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <EmailIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      البريد الإلكتروني
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.userId?.email || '—'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <PhoneIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      رقم الهاتف
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.userId?.mobileNumber || '—'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <CalendarMonthIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      تاريخ إنشاء الطلب
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.createdAt ? getDateDistance(order.createdAt) : '—'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
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
                  <Avatar sx={{ bgcolor: 'secondary.light' }}>
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
                        background: '#e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        mt: 1,
                        boxShadow: 0,
                        border: `1px solid #eee`,
                      }}
                    >
                      {order.serviceDetails}
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
                  <Avatar sx={{ bgcolor: 'warning.light' }}>
                    <MonetizationOnIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      سعر الطلب
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <span className="d-inline-flex align-items-center gap-1">
                        <span>{FormatNumber(order.priceOffer.price)}</span>
                        <img
                          src={'../Assets/Saudi_Riyal_Symbol.svg.webp'}
                          width="17"
                          height="17"
                          alt="ريال"
                        />
                      </span>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              {order.serviceDeleveryDate && (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: 'green' }}>
                      <TodayIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        تاريخ التسليم المتوقع
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        <span className="d-inline-flex align-items-center gap-1">
                          <span>
                            {formatDistanceToNowStrict(
                              order.serviceDeleveryDate,
                              {
                                addSuffix: true,
                                locale: ar,
                                includeSeconds: true,
                              }
                            )}
                          </span>
                        </span>
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={2}
                  gap={1}
                >
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <AssignmentTurnedInIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      حالة الطلب
                    </Typography>
                    <Chip
                      label={updateOrderStatusCases()}
                      color={getStatusColor(order.serviceStatus)}
                      variant="outlined"
                      sx={{ borderRadius: 2, px: 2, py: 1 }}
                    />
                  </Box>
                </Stack>
              </Grid>
              {order.priceOffer?.sendAt && (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <CalendarMonthIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        اخر تحديث للطلب
                      </Typography>
                      <Chip
                        label={getDateDistance(order.priceOffer.sendAt)}
                        color={getStatusColor(order.serviceStatus)}
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 2, py: 1 }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              )}

              {order.servicePaymentStatus === 'unpaid' ? (
                order.serviceStatus === 'in-progress' && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="warning.main"
                        gutterBottom
                      >
                        تنبيه: المبلغ غير مدفوع
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        يرجى دفع المبلغ المستحق في أقرب وقت ممكن لتجنب أي تأخير
                        في معالجة الطلب.
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        display={'flex'}
                        gap={0.5}
                        color="warning.main"
                      >
                        {order.priceOffer.price}
                        <img
                          src={'../Assets/Saudi_Riyal_Symbol.svg.webp'}
                          width="20"
                          height="20"
                          alt="ريال"
                        />
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.5)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          paragraph
                        >
                          تفاصيل الدفع:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="d-flex align-items-center gap-2"
                          paragraph
                        >
                          <strong>الآيبان:</strong>{' '}
                          <span className="text-primary ">
                            {process.env.REACT_APP_BANK_IBAN}
                          </span>
                          <ContentCopyIcon
                            sx={{ cursor: 'pointer', fontSize: 18 }}
                            titleAccess="نسخ الآيبان"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                process.env.REACT_APP_BANK_IBAN
                              );
                              successAlert('تم نسخ الآيبان بنجاح');
                            }}
                          />
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="d-flex align-items-center gap-2"
                          paragraph
                        >
                          <strong>رقم الحساب:</strong>{' '}
                          <span className="text-primary">
                            {process.env.REACT_APP_ACCOUNT_NUMBER}
                          </span>
                          <ContentCopyIcon
                            sx={{ cursor: 'pointer', fontSize: 18 }}
                            titleAccess="نسخ رقم الحساب"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                process.env.REACT_APP_ACCOUNT_NUMBER
                              );
                              successAlert('تم نسخ رقم الحساب بنجاح');
                            }}
                          />
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          <strong>اسم صاحب الحساب: </strong>{' '}
                          <span className="text-primary">
                            {process.env.REACT_APP_ACCOUNT_NAME}
                          </span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          <strong>نوع المصرف :</strong>{' '}
                          <span className="text-primary">
                            {process.env.REACT_APP_ACCOUNT_TYPE}
                          </span>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'center',
                          gap: 2,
                          mt: 2,
                          justifyContent: 'center',
                        }}
                      >
                        <a
                          href="https://wa.me/+966565125040"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success d-flex align-items-center gap-2"
                          style={{
                            minWidth: 140,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}
                        >
                          <FontAwesomeIcon icon={faWhatsapp} fontSize={'22'} />
                          Whatsapp
                        </a>
                        <a
                          href="mailto:companybov9@gmail.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-warning d-flex align-items-center gap-2 text-white"
                          style={{
                            minWidth: 140,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}
                        >
                          <FontAwesomeIcon icon={faMailBulk} fontSize={'22'} />
                          Gmail
                        </a>
                      </Box>

                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        paragraph
                      >
                        بعد الدفع الرجاء ارسال صورة من إيصال الدفع على الواتساب
                        أو الإيميل الخاص بنا وسيتم تحديث حالة الدفع من قبلنا.
                      </Typography>
                    </Box>
                  </Grid>
                )
              ) : (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={2}
                    gap={1}
                  >
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <PaidIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        حالة الدفع
                      </Typography>
                      <Chip
                        label="تم الدفع"
                        color="success"
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 2, py: 1 }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Grid>
            <Divider sx={{ my: 3 }} />
            {/* أزرار القبول والرفض وأي تفاصيل أخرى */}
            {order.priceOffer?.price > 0 &&
              order.serviceStatus === 'wait-for-approval' && (
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button
                    variant="success"
                    color="primary"
                    onClick={handleAcceptOffer}
                  >
                    قبول العرض
                  </Button>
                  <Button
                    variant="danger"
                    color="error"
                    onClick={handleRejectOffer}
                  >
                    رفض العرض
                  </Button>
                </Box>
              )}
          </CardContent>
        </Card>
      </Box>
      <RejectOfferModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={confirmReject}
      />
      <Footer margin="100px" />
    </div>
  );
}

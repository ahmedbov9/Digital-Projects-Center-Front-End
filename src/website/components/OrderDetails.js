import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import NavBar from './Navbar';
import Footer from './Footer';
import saudiRiyalLogo from '../../Assets/Saudi_Riyal_Symbol.svg.webp';
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
import RejectOfferModal from './RejectOfferModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';

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
      <div className="container">
        <h2 className="text-center mb-4 text-primary bg-white p-3 rounded">
          تفاصيل الطلب
        </h2>
        <div className="card shadow-lg border-0" style={{ maxWidth: '800px' }}>
          <div className="card-body p-3">
            <h5 className="text-primary">طلب {order.orderNumber}</h5>
            <h5 className="text-primary">
              البريد الالكتروني: {order.userId?.email || '—'}
            </h5>
            <h5 className="text-primary">
              رقم الهاتف: {order.userId?.mobileNumber || '—'}
            </h5>
            <hr />

            <p className="text-muted fw-bold">
              نوع الخدمة:{' '}
              <span className="fw-normal">
                {order.serviceType === 'web-development'
                  ? 'تطوير ويب'
                  : order.serviceType === 'technical-consultation'
                  ? 'استشارة تقنية'
                  : 'دعم فني'}
              </span>
            </p>

            {order.createdAt && (
              <p className="text-muted fw-bold">
                تاريخ إنشاء الطلب:{' '}
                <span className="fw-normal">
                  {getDateDistance(order.createdAt)}
                </span>
              </p>
            )}

            <p className="text-muted fw-bold">
              تفاصيل الخدمة:
              <div className="bg-secondary text-white p-2 rounded mt-1">
                {order.serviceDetails}
              </div>
            </p>

            {order.serviceDeleveryDate && (
              <p className="text-muted fw-bold">
                تاريخ التسليم:{' '}
                <span className="fw-normal">
                  {getDateDistance(order.serviceDeleveryDate)}
                </span>
              </p>
            )}

            <p className="text-muted fw-bold">
              حالة الطلب:{' '}
              <span
                className={`badge bg-${getStatusColor(order.serviceStatus)}`}
              >
                {updateOrderStatusCases()}
              </span>
            </p>

            {order.priceOffer?.sendAt && (
              <p className="text-muted fw-bold">
                تاريخ ارسال العرض:{' '}
                <span
                  className={`badge bg-${getStatusColor(order.serviceStatus)}`}
                >
                  {getDateDistance(order.priceOffer.sendAt)}
                </span>
              </p>
            )}

            {order.priceOffer?.price > 0 && (
              <>
                <p className="text-muted fw-bold">
                  سعر الطلب:{' '}
                  <span className="d-inline-flex align-items-center gap-1">
                    <span>{order.priceOffer.price}</span>
                    <img
                      src={saudiRiyalLogo}
                      width="17"
                      height="17"
                      alt="ريال"
                    />
                  </span>
                </p>

                {order.serviceStatus === 'wait-for-approval' && (
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="success" onClick={handleAcceptOffer}>
                      قبول العرض
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={handleRejectOffer}
                    >
                      رفض العرض
                    </Button>
                  </div>
                )}
              </>
            )}

            {order.priceOffer?.rejectReason && (
              <div style={{ width: 'fit-content' }}>
                <p className="text-muted fw-bold mt-3">
                  سبب رفض العرض:
                  <div className="bg-secondary text-white p-2 rounded mt-1">
                    {order.priceOffer.rejectReason}
                  </div>
                </p>
              </div>
            )}
            {order.servicePaymentStatus === 'unpaid' &&
              order.serviceStatus ===
                'in-progress'(
                  <div style={{ width: 'fit-content' }}>
                    <p className="text-muted fw-bold mt-3">
                      حالة الدفع:
                      <div className="bg-danger text-white p-2 rounded mt-1">
                        لم يتم الدفع بعد
                      </div>
                    </p>
                    <div className="w-100">
                      <p className="text-muted fw-bold mt-3">
                        يرجى دفع المبلغ المستحق :
                      </p>
                      <div className=" p-2 rounded mt-1">
                        <span className="d-inline-flex align-items-center gap-1">
                          <span>{order.priceOffer.price}</span>
                          <img
                            src={saudiRiyalLogo}
                            width="17"
                            height="17"
                            alt="ريال"
                          />
                        </span>
                      </div>
                      <div
                        style={{ border: '2px solid #ccc' }}
                        className="p-2 rounded mt-1"
                      >
                        <p className="text-muted text-center fw-blod mt-3">
                          تفاصيل الحساب البنكي :
                          <div className=" p-2 rounded mt-1">
                            <span className="fw-bold">الآيبان :</span>{' '}
                            {process.env.REACT_APP_BANK_IBAN}
                          </div>
                          <div className=" p-2 rounded mt-1">
                            <span className="fw-bold">رقم الحساب :</span>{' '}
                            {process.env.REACT_APP_ACCOUNT_NUMBER}
                          </div>
                          <div className=" p-2 rounded mt-1">
                            <span className="fw-bold">اسم صاحب الحساب :</span>{' '}
                            {process.env.REACT_APP_ACCOUNT_NAME}
                          </div>
                          <div className=" p-2 rounded mt-1">
                            <span className="fw-bold">نوع البنك :</span>{' '}
                            {process.env.REACT_APP_ACCOUNT_TYPE}
                          </div>
                        </p>
                      </div>
                      <p className="text-muted fw-bold mt-3">
                        بعد الدفع الرجاء ارسال صورة من ايصال الدفع على الواتس اب
                        او الايميل الخاص بنا وسيتم تحديث حالة الدفع من قبلنا
                      </p>
                      <div className="d-flex justify-content-center gap-3">
                        <p className="text-muted fw-bold mt-3">
                          <span className="fw-bold">
                            <a
                              href="https://wa.me/+966565125040"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ margin: '0 10px', color: 'green' }}
                            >
                              <FontAwesomeIcon
                                icon={faWhatsapp}
                                fontSize={'30'}
                              />
                            </a>
                          </span>{' '}
                        </p>
                        <p className="text-muted fw-bold mt-3">
                          <a
                            href="mailto:companybov9@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 10px', color: '#dca604' }}
                          >
                            <FontAwesomeIcon
                              icon={faMailBulk}
                              fontSize={'30'}
                            />
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>

      <RejectOfferModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={confirmReject}
      />

      <Footer margin="100px" />
    </div>
  );
}

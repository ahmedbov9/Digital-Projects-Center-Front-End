import { useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import { API } from '../Api/Api';
import { Axios } from '../Api/axios';
import Loading from './components/Loading';
import { getDateDistance } from '../helper/DateDistancs';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const orderStatus = [
    { status: 'pending', color: 'warning' },
    { status: 'in-progress', color: 'info' },
    { status: 'wait-for-pay', color: 'danger' },
    { status: 'wait-for-approval', color: 'danger' },
    { status: 'completed', color: 'success' },
    { status: 'cancelled', color: 'danger' },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(`${API.getCurrentUserOrders}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  console.log(orders);
  const getStatusColor = (status) => {
    const statusObj = orderStatus.find((s) => s.status === status);
    return statusObj ? statusObj.color : 'secondary'; // Default to 'secondary' if not found
  };

  const updateOrderStatusCases = (status) => {
    switch (status) {
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

  const getAllOrders = orders.map((order) => {
    return (
      <div className="col-md-6 col-lg-4" key={order.id}>
        <div className="card shadow-lg border-0">
          <div className="card-body">
            <h5 className="card-title text-primary">طلب {order.orderNumber}</h5>
            <p className="card-text text-muted">
              نوع الخدمة :{' '}
              {order.serviceType === 'web-development'
                ? 'تطوير ويب'
                : order.serviceType === 'technical-consultation'
                ? 'استشارة تقنية'
                : 'دعم فني'}
            </p>
            <p className="card-text text-muted">
              تاريخ انشاء الطلب : {getDateDistance(order.createdAt)}
            </p>
            <p className="card-text">
              حالة الطلب :{' '}
              <span
                className={`badge bg-${getStatusColor(order.serviceStatus)}`}
              >
                {updateOrderStatusCases(order.serviceStatus)}
              </span>
            </p>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                navigate(`/order/${order._id}`, {
                  state: { order },
                });
              }}
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    );
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div style={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
        <NavBar />
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="text-primary display-5  fw-bold">طلباتي</h1>
            <p className="text-muted">استعرض طلباتك بسهولة وراحة</p>
          </div>
          <div className="row">{getAllOrders}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}

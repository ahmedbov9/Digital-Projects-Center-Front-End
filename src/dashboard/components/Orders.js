import { Link } from 'react-router-dom';
import { API } from '../../Api/Api';
import { Axios } from '../../Api/axios';
import DashboardLayout from './DashboardLayout';
import TableLayout from './TableLayout';
import { Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Orders() {
  const columns = [
    {
      id: 'userId.email',
      label: 'إيميل المستخدم',
      minWidth: 150,
      render: (row) => row?.userId?.email || 'غير متوفر',
    },
    {
      id: 'orderNumber',
      label: 'رقم الطلب',
      minWidth: 100,
      render: (row) => `${row.orderNumber}`,
    },
    {
      id: 'serviceType',
      label: 'نوع الخدمة',
      minWidth: 120,
      render: (row) => {
        const map = {
          design: 'تصميم',
          programming: 'برمجة',
          consulting: 'استشارة',
        };
        return map[row.serviceType] || 'غير محدد';
      },
    },
    {
      id: 'serviceDeleveryDate',
      label: 'تاريخ التسليم',
      minWidth: 150,
      render: (row) => {
        const date = row.serviceDeleveryDate;
        return date
          ? formatDistanceToNow(new Date(date), {
              locale: ar,
              addSuffix: true,
              includeSeconds: true,
            })
          : '—';
      },
    },
    {
      id: 'serviceStatus',
      label: 'حالة الطلب',
      minWidth: 100,
      render: (row) => {
        const statusMap = {
          pending: 'قيد المعالجة',
          'in-progress': 'جاري التنفيذ',
          'wait-for-pay': 'انتظار الدفع',
          'wait-for-approval': 'انتظار موافقة العميل',
          completed: 'مكتمل',
          cancelled: 'ملغي',
        };
        return statusMap[row.serviceStatus] || '—';
      },
    },
    {
      id: 'servicePaymentStatus',
      label: 'حالة الدفع',
      minWidth: 100,
      render: (row) => {
        const statusMap = {
          paid: 'مدفوع',
          unpaid: 'غير مدفوع',
        };
        return statusMap[row.servicePaymentStatus] || '—';
      },
    },
    {
      id: 'action',
      label: 'الإجراء',
      minWidth: 100,
      render: (row) => (
        <Link className="btn btn-primary" to={`${row._id}`}>
          عرض التفاصيل
        </Link>
      ),
    },
  ];
  async function fetchOrders(page, limit, search = '') {
    let url = `${API.getAllOrders}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    try {
      const response = await Axios.get(url);
      return {
        data: response.data.data,
        total: response.data.totalData,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        data: [],
        total: 0,
      };
    }
  }

  return (
    <div style={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <DashboardLayout>
        <Typography variant="h3">الطلبات</Typography>
        <TableLayout columns={columns} fetchDataFunction={fetchOrders} />
      </DashboardLayout>
    </div>
  );
}

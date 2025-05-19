import { Button, Typography } from '@mui/material';
import DashboardLayout from './DashboardLayout';
import TableLayout from './TableLayout';
import { API } from '../../Api/Api';
import { Axios } from '../../Api/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  closeAlert,
  confirmAlert,
  errorAlert,
  loadingAlert,
  successAlert,
} from '../../website/components/Alertservice';
import { useState } from 'react';

export default function UnverifiedUsers() {
  const [refresher, setRefresher] = useState(0);
  const fetchUsers = async (page, limit, search = '') => {
    let url = `${API.getAllUnverifiedUsers}?page=${page}&limit=${limit}`;
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
      console.error('Error fetching users:', error);
      return {
        data: [],
        total: 0,
      };
    }
  };

  const handleDeleteUser = async (id, email) => {
    const confirmDelete = await confirmAlert({
      message: `هل أنت متأكد أنك تريد حذف المستخدم ${email}؟`,
    });
    if (!confirmDelete) {
      return;
    }
    const cofirmDeleteTwo = await confirmAlert({
      message: `سيتم حذف المستخدم ${email} نهائيا من النظام. هل أنت متأكد؟`,
      icon: 'error',
    });
    if (!cofirmDeleteTwo) {
      return;
    }
    await loadingAlert('جاري الحذف...');
    try {
      const response = await Axios.delete(`${API.deleteUnverifiedUser}`, {
        data: { id },
      });
      if (response.status === 200) {
        closeAlert();
        successAlert(response.data.message);
        setRefresher((prev) => prev + 1);
        // Optionally, you can refresh the user list or show a success message
      } else {
        closeAlert();
        errorAlert(response.data.message);
      }
    } catch (error) {
      errorAlert(error.response.data.message);
    }
  };

  const columns = [
    { id: 'email', label: 'البريد الإلكتروني', minWidth: 150 },
    { id: 'firstName', label: 'الاسم الاول', minWidth: 100 },
    { id: 'lastName', label: 'الاسم الاخير', minWidth: 100 },
    { id: 'mobileNumber', label: 'رقم الهاتف', minWidth: 120 },

    {
      id: 'createdAt',
      label: 'تاريخ التسجيل',
      minWidth: 150,
      render: (row) => {
        return row.createdAt
          ? formatDistanceToNow(row.createdAt, {
              locale: ar,
              addSuffix: true,
              includeSeconds: true,
            })
          : '—';
      },
    },
    {
      id: 'action',
      label: 'الإجراء',
      minWidth: 120,
      render: (row) => {
        return (
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ gap: 0.5 }}
              onClick={() => handleDeleteUser(row._id, row.email)}
            >
              حذف
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <DashboardLayout>
        <Typography variant="h3">المستخدمين الغير نشطين</Typography>
        <TableLayout
          columns={columns}
          fetchDataFunction={fetchUsers}
          refresher={refresher}
        />
      </DashboardLayout>
    </div>
  );
}

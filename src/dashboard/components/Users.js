import { Button, Typography } from '@mui/material';
import DashboardLayout from './DashboardLayout';
import TableLayout from './TableLayout';

import { API } from '../../Api/Api';
import { Axios } from '../../Api/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const columns = [
    { id: 'email', label: 'البريد الإلكتروني', minWidth: 150 },
    { id: 'firstName', label: 'الاسم الاول', minWidth: 100 },
    { id: 'lastName', label: 'الاسم الاخير', minWidth: 100 },
    { id: 'mobileNumber', label: 'رقم الهاتف', minWidth: 120 },
    {
      id: 'isAdmin',
      label: 'الصلاحية',
      minWidth: 120,
      render: (row) => {
        return (
          <>
            {row.isAdmin ? (
              <span className="text-success">
                مدير{' '}
                {currentUser._id === row._id && (
                  <span className="text-success">(انت)</span>
                )}
              </span>
            ) : (
              <span className="text-primary">مستخدم عادي</span>
            )}
          </>
        );
      },
    },
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
          currentUser._id !== row._id && (
            <div className="d-flex justify-content-center gap-2">
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ gap: 0.7 }}
                  startIcon={<EditIcon />}
                  onClick={() => {
                    navigate(`/dashboard/update-user/${row._id}`);
                  }}
                >
                  تعديل
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ gap: 0.5 }}
                  onClick={() => {
                    // Handle delete action
                    console.log('Delete user:', row._id);
                  }}
                >
                  حذف
                </Button>
              </>
            </div>
          )
        );
      },
    },
  ];

  const fetchUsers = async (page, limit, search = '') => {
    let url = `${API.getAllUsers}?page=${page}&limit=${limit}`;
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

  return (
    <div style={{ backgroundColor: '#e0e3e5', minHeight: '100vh' }}>
      <DashboardLayout>
        <Typography variant="h3">المستخدمين</Typography>
        <TableLayout columns={columns} fetchDataFunction={fetchUsers} />
      </DashboardLayout>
    </div>
  );
}

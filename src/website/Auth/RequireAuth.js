import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import Cookie from 'cookie-universal';
import { Axios } from '../../Api/axios';
import { API } from '../../Api/Api';
import Loading from '../components/Loading';

export default function RequireAuth({ isAdmin = false }) {
  const location = useLocation();
  const cookies = useMemo(() => Cookie(), []);
  const token = cookies.get('token');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await Axios.get(API.getCurrentUser);
        setCurrentUser(response.data);
      } catch (error) {
        cookies.remove('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading />;

  if (!token || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

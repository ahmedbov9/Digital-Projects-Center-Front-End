import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookie from 'cookie-universal';
import { Axios } from '../Api/axios';
import { API } from '../Api/Api';
import Loading from '../website/components/Loading';
export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);
export default function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // تخزين بيانات المستخدم
  const [loading, setLoading] = useState(true);
  const cookies = Cookie();
  const token = cookies.get('token');
  const navigate = useNavigate();
  const location = useLocation();

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
        navigate('/login', { state: { from: location }, replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) return <Loading />;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

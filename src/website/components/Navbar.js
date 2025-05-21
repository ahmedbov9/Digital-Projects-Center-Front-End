import { Link } from 'react-router-dom';
import './css/navbar.css';
import Cookie from 'cookie-universal';
import { useContext } from 'react';
import { WindowContext } from '../../context/WindowContext';
import AnchorTemporaryDrawer from './AnchorTemporaryDrawer';
import { UserContext } from '../../context/UserContext';
export default function NavBar(props) {
  const cookies = Cookie();
  const token = cookies.get('token');
  const margin = props.margin || '0px';
  const windowWidth = useContext(WindowContext).width;
  const { currentUser } = useContext(UserContext);
  const isAdmin = currentUser?.isAdmin || false;
  return windowWidth > 768 ? (
    <nav className="navbar bg-primary " style={{ marginBottom: margin }}>
      <div className="d-flex justify-content-around align-items-center w-100">
        <ul className="navbar_links">
          <li className="navbar_item">
            <Link to="/">الرئيسية</Link>
          </li>
          <li className="navbar_item">
            <Link to="/order-service">طلب خدمة</Link>
          </li>
          <li className="navbar_item">
            <Link to="/contact">تواصل معنا</Link>
          </li>
          {token && (
            <>
              <li className="navbar_item">
                <Link to="/my-orders">طلباتي</Link>
              </li>
              <li className="navbar_item">
                <Link to="/user-profile">الملف الشخصي</Link>
              </li>
              {}
            </>
          )}
          {!token && (
            <>
              <li className="navbar_item">
                <Link to="/login">تسجيل الدخول</Link>
              </li>
            </>
          )}
          {isAdmin && (
            <li className="navbar_item">
              <Link to="/dashboard">لوحة التحكم</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  ) : (
    <div className="bg-primary" style={{ marginBottom: margin }}>
      <AnchorTemporaryDrawer />
    </div>
  );
}

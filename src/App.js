import { Route, Routes } from 'react-router-dom';
import HomePage from './website/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderService from './website/OrderService';
import Contact from './website/Contact';
import RequireAuth from './website/Auth/RequireAuth';
import Login from './website/Auth/Login';
import Register from './website/Auth/Register';
import VerifyOTP from './website/Auth/VerifyOTP';
import UserProfile from './website/UserProfile';
import MyOrders from './website/MyOrders';
import UpdateUser from './website/Auth/UpdateUser';
import ChangeUserPassword from './website/components/ChangeUserPassword';
import OrderDetails from './website/components/OrderDetails';
import ForgetPassword from './website/Auth/ForgetPassword';
import ResetPassword from './website/Auth/ResetPassword';
import Dashboard from './dashboard/DashboardPage';
import Orders from './dashboard/components/Orders';
import Order from './dashboard/components/Order';
import Users from './dashboard/components/Users';
import UnverifiedUsers from './dashboard/components/UnverifiedUsers';
import NotFound from './website/404';
import UpdateUserFromAdmin from './dashboard/components/UpdateUserAdmin';
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        {/* Require Auth */}
        <Route element={<RequireAuth />}>
          <Route path="/order-service" element={<OrderService />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/edit-profile/:id" element={<UpdateUser />} />
          <Route path="/change-password" element={<ChangeUserPassword />} />
        </Route>
        {/* Admin-Routes Only*/}
        <Route element={<RequireAuth isAdmin={true} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="dashboard/orders" element={<Orders />} />
          <Route path="dashboard/orders/:id" element={<Order />} />
          <Route path="dashboard/users" element={<Users />} />
          <Route
            path="dashboard/update-user/:id"
            element={<UpdateUserFromAdmin />}
          />
          <Route
            path="dashboard/unverified-users"
            element={<UnverifiedUsers />}
          />
        </Route>
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

export const BASEURL = process.env.REACT_APP_BASE_URL;

export const API = {
  login: `${BASEURL}/auth/login`,
  registerStepOne: `${BASEURL}/auth/register-step-one`,
  verifyOtpAndRegister: `${BASEURL}/auth/verify-and-register`,
  getCurrentUser: `${BASEURL}/user/current-user`,
  createOrder: `${BASEURL}/order/create-order`,
  getCurrentUserOrders: `${BASEURL}/order/get-current-orders`,
  resendOTP: `${BASEURL}/auth/resend-otp`,
  sendEmailMessage: `${BASEURL}/contact/send-email`,
  updateUser: `${BASEURL}/user/update-user`,
  deleteAccount: `${BASEURL}/user/delete-user`,
  deleteUnverifiedUser: `${BASEURL}/user/delete-unverified-user`,
  changeUserPassword: `${BASEURL}/user/change-password`,
  forgotPassword: `${BASEURL}/auth/forget-password`,
  verifyPasswordOtp: `${BASEURL}/auth/verify-password-otp`,
  resetPassword: `${BASEURL}/auth/reset-password`,
  getAllOrders: `${BASEURL}/order/get-all-orders`,
  getOrderById: `${BASEURL}/order`,
  sendPriceOffer: `${BASEURL}/order/send-price-offer`,
  rejectOrder: `${BASEURL}/order/reject-order`, // from admin
  acceptOffer: `${BASEURL}/order/accept-price-offer`, // from user
  rejectOffer: `${BASEURL}/order/reject-price-offer`, // from user
  updatePaymentStatusToPaid: `${BASEURL}/order/update-payment-status`, // from user
  updateOrderStatusToCompleted: `${BASEURL}/order/update-order-status`, // from admin
  updateUserFromAdmin: `${BASEURL}/user/update-user-dashboard`,
  getAllUsers: `${BASEURL}/user/get-all-users`,
  getUserById: `${BASEURL}/user/get-user`,
  getAllUnverifiedUsers: `${BASEURL}/user/get-all-unverified-users`,
  dashboardStats: `${BASEURL}/dashboard/dashboard-stats`,
};

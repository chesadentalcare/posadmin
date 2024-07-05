import React , { useState, useEffect }from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../LoginSignUp/LoginPage';
import Signup from '../LoginSignUp/SignUp';
import { useLocation } from 'react-router-dom';
import AllOrders from '../Pages/AllOrders/AllOrders';
import PickList from '../Pages/PickList/PickList';
import ReadyForDispatch from '../Pages/ReadyForDispatch/ReadyForDispatch';
import ApprovedForDispatch from '../Pages/ApprovedForDispatch/ApprovedForDispatch';
import SHippedOrders from '../Pages/ShippedOrders/ShippedOrders';
import DeliveredOrders from '../Pages/DeliverdOrders/DeliveredOrders';
import OrderDetails from '../Pages/OrderDetails/OrderDetails';
import Grn from '../Pages/DC_Creation/Grn';
import Error404 from '../../ErrorPages/Error404';
import Error500 from '../../ErrorPages/Error500';
import ProductionRouting from '../ProductionRouting/ProductionRouting';
import Release_order from '../ProductionRouting/Release_order';

const AppRoutes = () => {
  const [ user, setUser ]= useState();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setUser({ token });
      // console.log(token)
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return <div className='loader1'>Loading...</div>;
  }

  return (
    <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/404" element={<Error404 />} />
    <Route path="/500" element={<Error500 />} />
    <Route path="/production_consumption" element={<ProductionRouting />} />
    
    {user ? (
      <>
        <Route path="/shipped_orders" element={<SHippedOrders />} />
        <Route path="/all_orders" element={<AllOrders />} />
        <Route path="/picklist" element={<PickList />} />
        <Route path="/ready-for-dispatch" element={<ReadyForDispatch />} />
		<Route path="/approved_for_dispatch" element={<ApprovedForDispatch />} />
        <Route path="/delivered-orders" element={<DeliveredOrders />} />
        <Route path="/order_details/:orderId" element={<OrderDetails />} />
        <Route path="/grn/:orderId" element={<Grn />} />
        <Route path="/release/:orderId" element={<Release_order />} />
      </>
    ) : (
      <Route path="*" element={<Navigate to="/" state={{ from: location }} />} />
    )}
  </Routes>
  );
};

export default AppRoutes;


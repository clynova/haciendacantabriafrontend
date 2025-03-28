import { Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { ProfileLayout } from "../layouts/MainLayout/ProfileLayout";
import { MyProfile } from "../pages/Perfil/MyProfile";
import { MyOrders } from "../pages/Perfil/MyOrders";
import { MyOrderDetails } from "../pages/Perfil/MyOrderDetails";
import { MyWishlist } from "../pages/Perfil/MyWishlist";
import { MyAddresses } from "../pages/Perfil/MyAddresses";
import { MyConfiguration } from "../pages/Perfil/MyConfiguration";
import { MyQuotations } from "../pages/Perfil/MyQuotations";
import { MyQuotationsDetails } from "../pages/Perfil/MyQuotationsDetails";
import { ProtectedRoute } from "../components/ProtectedRoute";

const profileRoutes = (
  <Route path="/profile" element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }>
    <Route element={<ProfileLayout />}>
      <Route index element={<MyProfile />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="orders/:orderId" element={<MyOrderDetails />} />
      <Route path="wishlist" element={<MyWishlist />} />
      <Route path="addresses" element={<MyAddresses />} />
      <Route path="settings" element={<MyConfiguration />} />
      <Route path="quotations" element={<MyQuotations />} />
      <Route path="quotations/:quotationId" element={<MyQuotationsDetails />} />
    </Route>
  </Route>
);

export default profileRoutes;
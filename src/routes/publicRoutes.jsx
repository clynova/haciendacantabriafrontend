import { Route } from "react-router-dom";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
import { Faq } from "../pages/Faq";
import { Policies } from "../pages/Policies";
import { Terms } from "../pages/Terms";
import { NotFound } from "../pages/NotFound";
import { MainLayout } from "../layouts/MainLayout/MainLayout";

const publicRoutes = [
  <Route key="main" element={<MainLayout />}>
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/faq" element={<Faq />} />
    <Route path="/policies" element={<Policies />} />
    <Route path="/terms" element={<Terms />} />
  </Route>,
  <Route key="not-found" path="*" element={<NotFound />} />
];

export default publicRoutes;
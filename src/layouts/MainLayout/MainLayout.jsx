import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col dark:bg-gray-900 ">
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export { MainLayout };
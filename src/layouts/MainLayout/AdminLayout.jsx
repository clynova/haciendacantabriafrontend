import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminSidebar />
                <main className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { AdminLayout };
import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from './ProfileSidebar';

const ProfileLayout = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ProfileSidebar />
                <main className="md:col-span-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { ProfileLayout };
import { useEffect } from "react";
import { useGlobal } from '../context/GlobalContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const NotFound = () => {
    const { setPageTitle } = useGlobal();

    useEffect(() => {
        setPageTitle('Página no encontrada | Cohesa');
    }, [setPageTitle]);

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <Header />
            <main className="flex-grow w-full" style={{ marginTop: '6rem' }}>
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-4xl font-bold text-center text-slate-200">
                        404 | página no encontrada
                    </h1>
                </div>
            </main>
            <Footer />
        </div>
    );
}


export { NotFound };
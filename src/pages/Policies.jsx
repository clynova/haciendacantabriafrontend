import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { policiesData } from '../data/policiesData';

const PolicySection = ({ policy }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-slate-800/50 rounded-lg overflow-hidden backdrop-blur-sm">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{policy.icon}</span>
                    <h3 className="text-xl font-semibold text-slate-200">
                        {policy.title}
                    </h3>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-slate-400"
                >
                    ▼
                </motion.div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 py-4 border-t border-slate-700">
                            {policy.sections.map((section, index) => (
                                <div key={index} className="mb-6 last:mb-0">
                                    <h4 className="text-lg font-medium text-slate-300 mb-2">
                                        {section.subtitle}
                                    </h4>
                                    <p className="text-slate-400 whitespace-pre-line">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Policies = () => {
    const { setPageTitle } = useGlobal();
    const { hero, policies } = policiesData;

    useEffect(() => {
        setPageTitle('Políticas | Hacienda Cantabria');
    }, [setPageTitle]);

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '6rem' }}>
                <div className="py-12">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-200 mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {hero.description}
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {policies.map((policy) => (
                            <PolicySection key={policy.id} policy={policy} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export { Policies };
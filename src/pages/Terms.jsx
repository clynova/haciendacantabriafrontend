import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { termsData } from '../data/termsData';

const TermSection = ({ section }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            className="backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-8 py-6 flex items-center justify-between group transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300">
                            <span className="text-2xl">{section.icon}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {section.title}
                        </h3>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 text-slate-400 group-hover:text-slate-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </button>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-8 py-6 border-t border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
                                {section.content.map((item, index) => (
                                    <div key={index} className="mb-8 last:mb-0">
                                        <h4 className="text-lg font-medium text-blue-400 mb-3">
                                            {item.subtitle}
                                        </h4>
                                        <p className="text-slate-300 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const Terms = () => {
    const { setPageTitle } = useGlobal();
    const { hero, sections } = termsData;

    useEffect(() => {
        setPageTitle('Términos y Condiciones | Hacienda Cantabria');
    }, [setPageTitle]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '6rem' }}>
                <div className="py-16">
                    <motion.div 
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-lg">
                            {hero.description}
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <TermSection section={section} />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        className="mt-20 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <p className="text-slate-400 text-sm">
                            Última actualización: Marzo 2024
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export { Terms };
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { useGlobal } from '../context/GlobalContext';
import { useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { faqData } from '../data/faqData';

const FAQSection = ({ title, questions }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
            <div className="space-y-4">
                {questions.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-700 rounded-lg overflow-hidden">
            <button
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-800 hover:bg-slate-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-left font-medium text-slate-200">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <HiChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 py-3 bg-slate-800/50">
                            <motion.p
                                initial={{ y: -10 }}
                                animate={{ y: 0 }}
                                exit={{ y: -10 }}
                                className="text-slate-300 whitespace-pre-line"
                            >
                                {answer}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Faq = () => {
    const { setPageTitle } = useGlobal();

    useEffect(() => {
        setPageTitle('Preguntas Frecuentes | Hacienda Cantabria');
    }, [setPageTitle]);

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '6rem' }}>
                <div className="py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-200 mb-6">
                            Preguntas Frecuentes
                        </h1>
                        <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios
                        </p>
                    </div>

                    {/* FAQ Sections */}
                    <div className="max-w-3xl mx-auto">
                        <FAQSection title="Sobre Nosotros" questions={faqData.empresa} />
                        <FAQSection title="Compras" questions={faqData.compras} />
                        <FAQSection title="Envíos y Entregas" questions={faqData.envios} />
                        <FAQSection title="Devoluciones" questions={faqData.devoluciones} />
                        <FAQSection title="Productos" questions={faqData.productos} />

                        {/* Contact Section */}
                        <div className="mt-12 p-6 bg-slate-800/50 rounded-lg text-center backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                ¿No encontró lo que buscaba?
                            </h2>
                            <p className="text-slate-300 mb-6">
                                Contáctenos directamente y estaremos encantados de ayudarle
                            </p>
                            <a
                                href="/contacto"
                                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25"
                            >
                                Contactar
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export { Faq };
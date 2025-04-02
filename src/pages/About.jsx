import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
// Eliminamos la importación del Footer
// import { Footer } from '../components/Footer';
import { aboutData } from '../data/aboutData';
import imgAbout from '../images/about/about-hero.webp';
import imgMission from '../images/about/mission.webp';
import imgVision from '../images/about/vision.webp';
import { motion } from 'framer-motion'; // Adding animation library

const About = () => {
    const [activeTab, setActiveTab] = useState('mission');
    const { hero, overview, content, values, contact, collaborators, producers } = aboutData;
    
    // Fade-in animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };
    
    // Stagger children animation
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };
    
    // Get the correct image for active tab
    const getActiveImage = (tab) => {
        return tab === 'mission' ? imgMission : imgVision;
    };

    // Scroll animation for sections
    const [scrollY, setScrollY] = useState(0);
    
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '6rem' }}>
                <div className="py-12">
                    {/* Hero Section - Removed gradient overlay */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-center mb-20 relative"
                    >
                        <h1 className="text-5xl font-bold text-slate-200 mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed text-lg">
                            {hero.description}
                        </p>
                    </motion.div>

                    {/* Company Overview - Removed blue overlay */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="grid md:grid-cols-2 gap-12 mb-24"
                    >
                        <div className="relative h-[450px] rounded-xl overflow-hidden shadow-xl group">
                            <div 
                                className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent z-10"
                                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                            ></div>
                            <img 
                                src={imgAbout}
                                alt="Nuestras instalaciones"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                style={{ transform: `translateY(${scrollY * 0.05}px)` }}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-slate-200 mb-6">
                                {overview.title}
                            </h2>
                            {overview.paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-slate-300 mb-6 last:mb-0 text-lg leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </motion.div>

                    {/* Mission & Vision Tabs - Updated colors */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mb-12"
                    >
                        <div className="flex justify-center space-x-6 mb-12">
                            <button
                                onClick={() => setActiveTab('mission')}
                                className={`px-8 py-3 rounded-full text-base font-medium transition-all duration-300 border-2
                                    ${activeTab === 'mission'
                                        ? 'bg-slate-700 text-white border-transparent shadow-lg'
                                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white'
                                    }`}
                            >
                                {content.mission.title}
                            </button>
                            <button
                                onClick={() => setActiveTab('vision')}
                                className={`px-8 py-3 rounded-full text-base font-medium transition-all duration-300 border-2
                                    ${activeTab === 'vision'
                                        ? 'bg-slate-700 text-white border-transparent shadow-lg'
                                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white'
                                    }`}
                            >
                                {content.vision.title}
                            </button>
                        </div>

                        {/* Mission & Vision Content - Reduced blur effect */}
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="bg-slate-800/90 rounded-2xl p-10 shadow-xl border border-slate-700/50">
                                <div className="grid md:grid-cols-2 gap-10 items-center">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-6 text-slate-200">
                                            {content[activeTab].title}
                                        </h2>
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                            {content[activeTab].description}
                                        </p>
                                    </div>
                                    <div className="relative h-[350px] rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-10"></div>
                                        <img
                                            src={getActiveImage(activeTab)}
                                            alt={content[activeTab].title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Values Section - Updated colors */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mt-24 mb-20"
                    >
                        <h2 className="text-4xl font-bold text-center text-slate-200 mb-12">
                            Nuestros Valores
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {values.map((value, index) => (
                                <motion.div 
                                    key={index} 
                                    variants={fadeIn}
                                    className="bg-slate-800/80 rounded-xl p-8 text-center border border-slate-700/50 hover:border-slate-500 transition-all duration-300 hover:shadow-lg group"
                                >
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                                    <h3 className="text-2xl font-bold text-slate-200 mb-4 group-hover:text-white transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* New Section: Collaborators & Producers - Updated colors */}
                    {(collaborators || producers) && (
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="mt-24 mb-20"
                        >
                            <div className="bg-slate-800/90 rounded-2xl p-10 shadow-xl border border-slate-700/50">
                                <div className="grid md:grid-cols-2 gap-12">
                                    {collaborators && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-200 mb-6">
                                                Nuestros Aliados Estratégicos
                                            </h2>
                                            <ul className="space-y-3">
                                                {collaborators.map((collaborator, index) => (
                                                    <li key={index} className="text-slate-300 flex items-center">
                                                        <span className="text-slate-400 mr-2">•</span> {collaborator}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {producers && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-200 mb-6">
                                                Somos Productores
                                            </h2>
                                            <ul className="space-y-3">
                                                {producers.map((producer, index) => (
                                                    <li key={index} className="text-slate-300 flex items-center">
                                                        <span className="text-slate-400 mr-2">•</span> {producer}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Contact Information - Updated colors */}
                    {contact && (
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="mt-24 text-center"
                        >
                            <h2 className="text-3xl font-bold text-slate-200 mb-8">
                                Contáctanos
                            </h2>
                            <div className="bg-slate-800/90 rounded-2xl p-8 shadow-xl inline-block mx-auto border border-slate-700/50">
                                <div className="space-y-4 text-left">
                                    <p className="text-slate-300 flex items-center">
                                        <span className="text-slate-400 mr-3">📍</span> {contact.office}
                                    </p>
                                    <p className="text-slate-300 flex items-center">
                                        <span className="text-slate-400 mr-3">📞</span> {contact.phone}
                                    </p>
                                    <p className="text-slate-300 flex items-center">
                                        <span className="text-slate-400 mr-3">✉️</span> 
                                        <a href={`mailto:${contact.email}`} className="text-slate-300 hover:text-white hover:underline">
                                            {contact.email}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
            {/* Eliminamos el Footer de aquí */}
        </div>
    );
};

export { About };

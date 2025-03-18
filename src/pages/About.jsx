import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { aboutData } from '../data/aboutData';

const About = () => {
    const [activeTab, setActiveTab] = useState('mission');
    const { hero, overview, content, values } = aboutData;

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '6rem' }}>
                <div className="py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-200 mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {hero.description}
                        </p>
                    </div>

                    {/* Company Overview */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <img 
                                src={overview.image}
                                alt="Nuestras instalaciones"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-slate-200 mb-4">
                                {overview.title}
                            </h2>
                            {overview.paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-slate-300 mb-4 last:mb-0">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Mission & Vision Tabs */}
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab('mission')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === 'mission'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-300 hover:text-blue-400'
                                }`}
                        >
                            Nuestro Compromiso
                        </button>
                        <button
                            onClick={() => setActiveTab('vision')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === 'vision'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-300 hover:text-blue-400'
                                }`}
                        >
                            Nuestros Productos
                        </button>
                    </div>

                    {/* Mission & Vision Content */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur-sm">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-200 mb-4">
                                        {content[activeTab].title}
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed">
                                        {content[activeTab].description}
                                    </p>
                                </div>
                                <div className="relative h-[300px] rounded-lg overflow-hidden">
                                    <img 
                                        src={content[activeTab].image}
                                        alt={content[activeTab].title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center text-slate-200 mb-8">
                            Nuestros Valores
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="bg-slate-800/30 rounded-lg p-6 text-center">
                                    <div className="text-4xl mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-300">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export { About };
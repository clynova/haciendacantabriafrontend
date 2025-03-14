import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const content = {
    mission: {
      title: "Nuestra Misión",
      description: "Brindar soluciones integrales en la distribución de productos cárnicos y alimenticios de alta calidad, garantizando la satisfacción de nuestros clientes a través de un servicio excepcional y productos que cumplen con los más altos estándares de calidad.",
      image: "/images/mission.jpg" // Asegúrate de tener esta imagen en tu carpeta public
    },
    vision: {
      title: "Nuestra Visión",
      description: "Ser reconocidos como la empresa líder en la distribución de productos cárnicos y alimenticios en la región, destacando por nuestra excelencia operativa, innovación constante y compromiso con la satisfacción del cliente.",
      image: "/images/vision.jpg" // Asegúrate de tener esta imagen en tu carpeta public
    },
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '6rem' }}>
        <div className="py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-200 mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Desde 2010, hemos estado comprometidos con la excelencia en la distribución de productos cárnicos de la más alta calidad. Nuestra dedicación a la calidad y el servicio nos ha convertido en un referente en el mercado.
            </p>
          </div>

          {/* Company Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img 
                src="/images/about-hero.jpg" // Asegúrate de tener esta imagen
                alt="Nuestras instalaciones"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-slate-200 mb-4">
                Quiénes Somos
              </h2>
              <p className="text-slate-300 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-slate-300">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
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
              Misión
            </button>
            <button
              onClick={() => setActiveTab('vision')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === 'vision'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:text-blue-400'
                }`}
            >
              Visión
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
              {[
                {
                  title: "Calidad",
                  description: "Compromiso inquebrantable con la excelencia en todos nuestros productos.",
                  icon: "🌟"
                },
                {
                  title: "Integridad",
                  description: "Operamos con total transparencia y ética en cada aspecto de nuestro negocio.",
                  icon: "🤝"
                },
                {
                  title: "Innovación",
                  description: "Buscamos constantemente nuevas formas de mejorar y crecer.",
                  icon: "💡"
                }
              ].map((value, index) => (
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
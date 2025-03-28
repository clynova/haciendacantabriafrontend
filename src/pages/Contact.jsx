import React, { useState } from 'react';
import { HiLocationMarker, HiPhone, HiMail, HiClock, HiUser, HiChat } from 'react-icons/hi';
import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';
import { sendContactForm } from '../services/utilService';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast'; // Importamos react-hot-toast

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    const companyInfo = {
        name: "Hacienda Cantabria",
        address: "Dirección de la empresa, Ciudad, País",
        phone: "+56 9 1234 5678",
        email: "contacto@haciendacantabria.cl",
        workingHours: "Lunes a Viernes: 9:00 - 18:00",
        socialMedia: {
            facebook: "https://facebook.com/haciendacantabria",
            instagram: "https://instagram.com/haciendacantabria"
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Por favor, completa todos los campos');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Por favor, ingresa un email válido');
            return;
        }
        
        try {
            setSending(true);
            
            // Mostrar un toast de carga
            const loadingToast = toast.loading('Enviando mensaje...');
            
            const response = await sendContactForm(formData);
            
            // Eliminar el toast de carga
            toast.dismiss(loadingToast);
            
            if (response.success) {
                toast.success('Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            } else {
                toast.error(response.message || 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            toast.error('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Agregamos el componente Toaster para mostrar las notificaciones */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    // Estilos por defecto para todos los toasts
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Duración personalizada
                    duration: 4000,
                    // Estilos específicos para los tipos de toast
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10B981',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
            
            <Header />
            
            <div className="bg-blue-600 dark:bg-blue-800">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Contáctanos
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                            Estamos aquí para responder tus preguntas y ayudarte en lo que necesites
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Información de Contacto
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-blue-500/10 rounded-full">
                                        <HiLocationMarker className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</p>
                                    <p className="text-base text-gray-900 dark:text-white">{companyInfo.address}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-blue-500/10 rounded-full">
                                        <HiPhone className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                                    <p className="text-base text-gray-900 dark:text-white">{companyInfo.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-blue-500/10 rounded-full">
                                        <HiMail className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-base text-gray-900 dark:text-white">{companyInfo.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-blue-500/10 rounded-full">
                                        <HiClock className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Horario de Atención</p>
                                    <p className="text-base text-gray-900 dark:text-white">{companyInfo.workingHours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="mt-8 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Síguenos en redes sociales
                            </h3>
                            <div className="flex space-x-6">
                                <a 
                                    href={companyInfo.socialMedia.facebook} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    <FaFacebookSquare className="h-8 w-8" />
                                </a>
                                <a 
                                    href={companyInfo.socialMedia.instagram} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    <FaInstagram className="h-8 w-8" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Envíanos un mensaje
                            </h2>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <HiUser className="h-5 w-5 text-gray-400" />
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <HiMail className="h-5 w-5 text-gray-400" />
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <HiChat className="h-5 w-5 text-gray-400" />
                                    Mensaje
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                         focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                                         transition duration-200"
                            >
                                {sending ? 'Enviando...' : 'Enviar mensaje'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Contact };
export default Contact;
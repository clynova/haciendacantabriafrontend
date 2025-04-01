import React, { useState } from 'react';
import { HiLocationMarker, HiPhone, HiMail, HiClock, HiUser, HiChat } from 'react-icons/hi';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { sendContactForm } from '../services/utilService';
import { Header } from '../components/Header';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    // Actualizado con la información de COHESA
    const companyInfo = {
        name: "COHESA",
        address: "Oficina 811 - 812, Reñaca Norte N° 265, Concon",
        phone: "+56 9 4273 4373",
        email: "team@cohesaspa.com",
        workingHours: "Lunes a Viernes: 9:00 - 18:00",
        socialMedia: {
            facebook: "https://facebook.com/cohesaspa",
            instagram: "https://instagram.com/cohesaspa",
            linkedin: "https://linkedin.com/company/cohesaspa"
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
        <div className="min-h-screen bg-gray-900">
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
            
            <div className="bg-slate-800">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Contáctanos
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300">
                            Estamos aquí para responder tus preguntas y ayudarte en lo que necesites
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-slate-800/80 rounded-xl shadow-xl p-8 border border-slate-700/50">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Información de Contacto
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-slate-700 rounded-full">
                                        <HiLocationMarker className="h-6 w-6 text-slate-300" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Dirección</p>
                                    <p className="text-base text-white">{companyInfo.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-slate-700 rounded-full">
                                        <HiPhone className="h-6 w-6 text-slate-300" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Teléfono</p>
                                    <p className="text-base text-white">{companyInfo.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-slate-700 rounded-full">
                                        <HiMail className="h-6 w-6 text-slate-300" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Email</p>
                                    <p className="text-base text-white">{companyInfo.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-slate-700 rounded-full">
                                        <HiClock className="h-6 w-6 text-slate-300" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Horario de Atención</p>
                                    <p className="text-base text-white">{companyInfo.workingHours}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Social Media Section */}
                        <div className="mt-8 bg-slate-700/50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-white mb-4">
                                Síguenos en redes sociales
                            </h3>
                            <div className="flex space-x-6">
                                <a 
                                    href={companyInfo.socialMedia.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    <FaFacebookSquare className="h-8 w-8" />
                                </a>
                                <a 
                                    href={companyInfo.socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    <FaInstagram className="h-8 w-8" />
                                </a>
                                <a 
                                    href={companyInfo.socialMedia.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    <FaLinkedin className="h-8 w-8" />
                                </a>
                            </div>
                        </div>
                        
                        {/* Map or Additional Info */}
                        <div className="mt-8">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.0633450742997!2d-71.5561!3d-32.9794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689de84aeaaaaab%3A0x8e2f5650b721a70f!2sRe%C3%B1aca%20Norte%20265%2C%20Vi%C3%B1a%20del%20Mar%2C%20Valpara%C3%ADso!5e0!3m2!1ses!2scl!4v1617304450951!5m2!1ses!2scl" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    title="Ubicación de COHESA"
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Form */}
                    <div className="bg-slate-800/80 rounded-xl shadow-xl overflow-hidden border border-slate-700/50">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Envíanos un mensaje
                            </h2>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <HiUser className="h-5 w-5 text-slate-400" />
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-600 rounded-lg
                                              bg-slate-700 text-white
                                             focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <HiMail className="h-5 w-5 text-slate-400" />
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-600 rounded-lg
                                              bg-slate-700 text-white
                                             focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <HiChat className="h-5 w-5 text-slate-400" />
                                    Mensaje
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-600 rounded-lg
                                              bg-slate-700 text-white
                                             focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full px-6 py-3 bg-slate-600 text-white rounded-lg font-medium
                                         hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400
                                          focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed
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

import { useGlobal } from '../../context/GlobalContext';
import { useEffect, useState } from 'react';
import RegisterForm from '../../components/Auth/RegisterForm';
import AuthIllustration from '../../components/Auth/AuthIllustration';
import illustration from "../../images/login-illustration.svg";
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ensureCsrfCookie } from '../../services/api'; // Import ensureCsrfCookie

const Register = () => {
    const { setPageTitle } = useGlobal();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repPassword: '',
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repPassword: '',
    });
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        repPassword: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isCsrfReady, setIsCsrfReady] = useState(false); // Nuevo estado para CSRF
    const [csrfError, setCsrfError] = useState(''); // Nuevo estado para error CSRF

    useEffect(() => {
        setPageTitle('Registro | Cohesa');

        console.log("Componente Register Montado: Intentando asegurar cookie CSRF...");
        setIsLoading(true); // Mostrar carga mientras se verifica CSRF
        setCsrfError(''); // Limpiar error previo

        ensureCsrfCookie()
            .then(success => {
                if (success) {
                    console.log("Cookie CSRF asegurada o ya existía.");
                    setIsCsrfReady(true); // Marcar como listo
                } else {
                    console.error("FALLO al asegurar la cookie CSRF. El registro podría fallar.");
                    setCsrfError("No se pudo establecer la conexión segura. Intenta recargar la página.");
                }
            })
            .catch(error => {
                console.error("Error inesperado llamando a ensureCsrfCookie:", error);
                setCsrfError("Ocurrió un error inesperado al preparar el formulario.");
            })
            .finally(() => {
                setIsLoading(false); // Ocultar carga general
            });

    }, [setPageTitle]);

    const validateNombre = (value) => value ? '' : 'El nombre es requerido';
    const validateApellido = (value) => value ? '' : 'El apellido es requerido';
    const validateEmail = (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!value) return 'El correo es requerido';
        if (!emailRegex.test(value)) return 'Correo electrónico inválido';
        return '';
    };
    const validatePassword = (value) => {
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una mayúscula';
        if (!/[a-z]/.test(value)) return 'La contraseña debe incluir al menos una minúscula';
        if (!/[0-9]/.test(value)) return 'La contraseña debe incluir al menos un número';
        return '';
    };
    const validateRepPassword = (value) => {
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'firstName':
                error = validateNombre(value);
                break;
            case 'lastName':
                error = validateApellido(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'repPassword':
                error = validateRepPassword(value);
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formData[name]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Verificar si CSRF está listo antes de proceder
        if (!isCsrfReady) {
            toast.error(csrfError || "La configuración de seguridad aún no está lista. Por favor, espera o recarga.");
            return;
        }

        console.log('Iniciando registro...'); // Log para depuración

        // Validación de campos
        const fields = ['firstName', 'lastName', 'email', 'password', 'repPassword'];
        const touchedFields = {};
        let isValid = true;
        fields.forEach(field => {
            touchedFields[field] = true;
            if (!validateField(field, formData[field])) isValid = false;
        });
        setTouched(touchedFields);
        if (!isValid) return;

        console.log(touchedFields);

        setIsLoading(true);
        try {
            await register(formData);
            toast.success('¡Registro exitoso! Por favor verifica tu correo electrónico.', {
                icon: '✉️',
            });
            navigate('/auth/verification-pending', {
                state: {
                    email: formData.email,
                    message: 'Te hemos enviado un codigo al correo para que puedas verificar tu cuenta. Por favor revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.'
                }
            });
        } catch (error) {
            if (error.status === 400) {
                toast.error('Este correo electrónico ya está registrado', {
                    icon: '⚠️',
                });
            } else if (error.status === 409) {
                toast.error(error.msg || 'Por favor verifica los datos ingresados', {
                    icon: '❌',
                });
            } else {
                toast.error('Hubo un problema al crear tu cuenta. Por favor intenta nuevamente.', {
                    icon: '🔥',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        console.log(`Iniciando sesión con ${provider}`);
        // Por ahora solo mostramos un mensaje informativo
        toast.error(`Inicio de sesión con ${provider} no está implementado aún`);
    };

    if (csrfError) {
        // Muestra un error bloqueante si CSRF falló catastróficamente
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <h2>Error de Seguridad</h2>
                <p>{csrfError}</p>
                <button onClick={() => window.location.reload()}>Recargar Página</button>
            </div>
        );
    }

    return (
        <>
            <AuthIllustration illustration={illustration} />
            <RegisterForm
                onSubmit={handleRegister}
                onSocialLogin={handleSocialLogin}
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                isLoading={isLoading}
            />
        </>
    );
};

export { Register };
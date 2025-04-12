import { useGlobal } from '../../context/GlobalContext';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import AuthIllustration from '../../components/Auth/AuthIllustration';
import illustration from "../../images/login-illustration.svg";
import { toast } from 'react-hot-toast';
// Importa la función correcta desde tu archivo api/service
import { ensureCsrfCookie } from '../../services/api'; // <-- Asegúrate que la ruta sea correcta y el nombre sea ensureCsrfCookie

const Login = () => {
  const { setPageTitle } = useGlobal();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCsrfReady, setIsCsrfReady] = useState(false); // Nuevo estado para CSRF
  const [csrfError, setCsrfError] = useState(''); // Nuevo estado para error CSRF
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    rememberMe: Boolean(localStorage.getItem('rememberedEmail')),
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // --- Funciones de validación y manejo de inputs (sin cambios) ---
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) return 'El correo es requerido';
    if (!emailRegex.test(email)) return 'Correo electrónico inválido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    if (touched[name]) {
      validateField(name, value);
    }
  };
  // --- Fin de funciones sin cambios ---


  // useEffect para asegurar la cookie CSRF al montar el componente
  useEffect(() => {
    setPageTitle('Ingresar | Cohesa'); // Establecer título de página

    console.log("Componente Login Montado: Intentando asegurar cookie CSRF...");
    setIsLoading(true); // Mostrar carga mientras se verifica CSRF
    setCsrfError(''); // Limpiar error previo

    ensureCsrfCookie()
      .then(success => {
        if (success) {
          console.log("Cookie CSRF asegurada o ya existía.");
          setIsCsrfReady(true); // Marcar como listo
        } else {
          console.error("FALLO al asegurar la cookie CSRF. El login podría fallar.");
          setCsrfError("No se pudo establecer la conexión segura. Intenta recargar la página.");
          // Puedes decidir si quieres mostrar un error más prominente o bloquear el formulario
        }
      })
      .catch(error => {
        // Esto no debería pasar si ensureCsrfCookie maneja sus propios errores, pero por si acaso
        console.error("Error inesperado llamando a ensureCsrfCookie:", error);
        setCsrfError("Ocurrió un error inesperado al preparar el formulario.");
      })
      .finally(() => {
        setIsLoading(false); // Ocultar carga general (o tener un estado de carga específico para CSRF)
      });

  }, [setPageTitle]); // Dependencia setPageTitle


  const handleLogin = async (e) => {
    e.preventDefault();

    // Verificar si CSRF está listo antes de proceder
    if (!isCsrfReady) {
      toast.error(csrfError || "La configuración de seguridad aún no está lista. Por favor, espera o recarga.");
      return;
    }

    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    setTouched({ email: true, password: true });

    if (!emailValid || !passwordValid) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' })); // Limpiar error general previo
    try {
      // YA NO necesitamos llamar a getCsrfToken aquí, se hizo en el useEffect
      // await getCsrfToken(); // <-- ELIMINADO

      await login({
        email: formData.email,
        password: formData.password
      });

      // Manejar "Recordarme"
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('¡Bienvenido de vuelta!');
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      // Verifica si el error es de CSRF inválido
      const isCsrfError = error.response?.status === 403 && error.response?.data?.message === 'Invalid CSRF token';

      const errorMessage =
        isCsrfError ? 'Error de seguridad (CSRF). Intenta recargar la página.' :
        error.response?.status === 401 ? 'Credenciales incorrectas' :
        error.response?.status === 403 ? 'Tu cuenta no está verificada. Por favor, verifica tu correo electrónico.' :
        error.response?.status === 423 ? 'Tu cuenta ha sido suspendida. Contacta con soporte.' :
        'Error al iniciar sesión. Por favor, intenta nuevamente.';

      toast.error(errorMessage);
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // --- handleSocialLogin (sin cambios) ---
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      toast.error(`Inicio de sesión con ${provider} no está implementado aún`);
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      toast.error(`Error al iniciar sesión con ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- Fin de handleSocialLogin ---

  // Renderizado condicional o bloqueo del formulario mientras CSRF no está listo
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
      <LoginForm
        onSubmit={handleLogin}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        // Puedes deshabilitar el botón si CSRF no está listo o si ya está cargando
        isLoading={isLoading || !isCsrfReady}
        // Opcional: Mostrar un mensaje mientras CSRF carga
        loadingMessage={!isCsrfReady ? "Inicializando seguridad..." : "Ingresando..."}
        onSocialLogin={handleSocialLogin}
      />
      <AuthIllustration illustration={illustration} />
    </>
  );
};

export { Login };

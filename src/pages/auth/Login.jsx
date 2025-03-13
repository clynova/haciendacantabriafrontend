import { useGlobal } from '../../context/GlobalContext';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import AuthIllustration from '../../components/Auth/AuthIllustration';
import illustration from "../../images/login-illustration.svg";
import { toast } from 'react-hot-toast';

const Login = () => {
  const { setPageTitle } = useGlobal();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    setTouched({ email: true, password: true });
    
    if (!emailValid || !passwordValid) return;
    
    setIsLoading(true);
    try {
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
      const errorMessage = 
        error.response?.status === 401 ? 'Credenciales incorrectas' :
        error.response?.status === 403 ? 'Tu cuenta no está verificada. Por favor, verifica tu correo electrónico.' :
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

  // Nueva función para manejar el inicio de sesión social
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica de autenticación social
      // Por ahora solo mostramos un mensaje informativo
      toast.error(`Inicio de sesión con ${provider} no está implementado aún`);
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      toast.error(`Error al iniciar sesión con ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle('Ingresar | LynFront');
  }, [setPageTitle]);

  return (
    <>
      <LoginForm
        onSubmit={handleLogin}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        isLoading={isLoading}
        onSocialLogin={handleSocialLogin}
      />
      <AuthIllustration illustration={illustration} />
    </>
  );
};

export { Login };
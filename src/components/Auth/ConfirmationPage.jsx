import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';
import AuthIllustration from './AuthIllustration';
import illustration from "../../images/happy-illustration.svg";

const ConfirmationPage = ({ type }) => {
    let title = '';
    let message = '';
    let actionText = '';
    let actionLink = '';

    if (type === 'account') {
        title = 'Cuenta Confirmada';
        message = 'Tu cuenta ha sido creada exitosamente.';
        actionText = 'Iniciar sesión';
        actionLink = '/auth';
    } else if (type === 'password') {
        title = 'Contraseña Actualizada';
        message = 'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.';
        actionText = 'Iniciar sesión';
        actionLink = '/auth';
    } else {
        title = 'Confirmación';
        message = 'Acción completada exitosamente.';
        actionText = 'Continuar';
        actionLink = '/';
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center p-12 w-full lg:w-1/2">
                <div className="text-green-500 mb-6">
                    <HiCheckCircle className="h-24 w-24" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h1>
                <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg mb-8 max-w-md">
                    <p className="text-green-700 dark:text-green-300 text-center">
                        {message}
                    </p>
                </div>
                
                <Link 
                    to={actionLink}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                             text-white rounded-lg font-semibold transition-all duration-300"
                >
                    {actionText}
                </Link>
            </div>
            <AuthIllustration illustration={illustration} />
        </>
    );
};

ConfirmationPage.propTypes = {
    type: PropTypes.string.isRequired,
};

export default ConfirmationPage;

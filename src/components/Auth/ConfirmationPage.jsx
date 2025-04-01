

import PropTypes from 'prop-types';
import AuthIllustration from './AuthIllustration';
import illustration from "../../images/happy-illustration.svg";

const ConfirmationPage = ({ type }) => {
    // ...existing styling y estructura base...
    let title = '';
    let message = '';

    if (type === 'account') {
        title = 'Cuenta Confirmada';
        message = 'Su cuenta ha sido creada exitosamente.';
    } else if (type === 'password') {
        title = 'Reseteo de Contraseña Exitoso';
        message = 'Su contraseña ha sido actualizada correctamente.';
    } else {
        title = 'Confirmación';
        message = 'Acción completada exitosamente.';
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center p-12">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">{message}</p>
                {/* ...posibles botones o enlaces de navegación... */}
            </div>
            <AuthIllustration illustration={illustration} />
        </>
    );
};

ConfirmationPage.propTypes = {
    type: PropTypes.string.isRequired,
};

export default ConfirmationPage;

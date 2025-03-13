import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import PropTypes from 'prop-types';

const LoadingOverlay = ({ message = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
        <AiOutlineLoading3Quarters className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-200 text-sm">{message}</p>
      </div>
    </div>
  );
};
LoadingOverlay.propTypes = {
  message: PropTypes.string
};


export default LoadingOverlay;

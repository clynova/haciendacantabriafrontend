import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const TokenInput = ({ length = 6, onChange }) => {
    const [digits, setDigits] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        // Inicializar refs
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index, value) => {
        // Solo permitir números
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        // Emitir el valor completo
        onChange(newDigits.join(''));

        // Auto-focus al siguiente input
        if (value !== '' && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Mover al input anterior con backspace
        if (e.key === 'Backspace' && digits[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const pastedNumbers = pastedText.replace(/[^\d]/g, '').split('').slice(0, length);
        
        const newDigits = [...digits];
        pastedNumbers.forEach((num, index) => {
            if (index < length) newDigits[index] = num;
        });
        
        setDigits(newDigits);
        onChange(newDigits.join(''));

        // Focus en el siguiente campo vacío o el último si está lleno
        const nextEmptyIndex = newDigits.findIndex(digit => digit === '');
        const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div className="flex justify-between gap-2">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
                             border-gray-300 dark:border-gray-600 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                             dark:bg-gray-700 dark:text-white
                             transition-colors duration-200"
                    style={{ appearance: 'textfield' }}
                />
            ))}
        </div>
    );
};

TokenInput.propTypes = {
    length: PropTypes.number,
    onChange: PropTypes.func.isRequired,
};

export default TokenInput;
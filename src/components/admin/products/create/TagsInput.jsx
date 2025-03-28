import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const TagsInput = ({ tags = [], onChange, placeholder, helperText }) => {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            // Evitar duplicados
            if (!tags.includes(input.trim())) {
                onChange([...tags, input.trim()]);
            }
            setInput('');
        }
    };

    const removeTag = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        onChange(newTags);
    };

    return (
        <div className="w-full">
            <div className="mb-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <div 
                        key={index}
                        className="flex items-center bg-blue-600/40 text-blue-100 px-3 py-1 rounded-full text-sm"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 text-blue-200 hover:text-white focus:outline-none"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                />
            </div>
            
            {helperText && (
                <p className="text-xs text-gray-400 mt-1">
                    {helperText}
                </p>
            )}
        </div>
    );
};

TagsInput.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    helperText: PropTypes.string
};
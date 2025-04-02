import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HiPlus } from 'react-icons/hi';
import { getAllTags } from '../../../../services/adminService';
import { useAuth } from '../../../../context/AuthContext';

export const TagsInput = ({ tags = [], onChange, placeholder, helperText, showSuggestions = true }) => {
    const { token } = useAuth();
    const [input, setInput] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    useEffect(() => {
        if (showSuggestions) {
            fetchAvailableTags();
        }
    }, [token, showSuggestions]);

    const fetchAvailableTags = async () => {
        try {
            const response = await getAllTags(token);
            if (response.success) {
                setAvailableTags(response.tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        
        // Si termina en coma, procesar las etiquetas
        if (value.endsWith(',')) {
            const newTags = value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0 && !tags.includes(tag));
            
            if (newTags.length > 0) {
                onChange([...tags, ...newTags]);
                setInput('');
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            const newTag = input.trim();
            if (!tags.includes(newTag)) {
                onChange([...tags, newTag]);
                setInput('');
            }
        }
    };

    const handleTagSelect = (tag) => {
        if (!tags.includes(tag)) {
            onChange([...tags, tag]);
            setInput('');
        }
        setShowTagDropdown(false);
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        onChange(newTags);
    };

    const filteredTags = availableTags.filter(tag => 
        !tags.includes(tag) && 
        tag.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="mb-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <div 
                        key={tag}
                        className="flex items-center bg-blue-600/40 text-blue-100 px-3 py-1 rounded-full text-sm"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-200 hover:text-white focus:outline-none"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="relative">
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowTagDropdown(true)}
                        placeholder={placeholder || "Escribe una etiqueta y presiona Enter o coma"}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white pr-10"
                    />
                    {showSuggestions && (
                        <button
                            type="button"
                            onClick={() => setShowTagDropdown(!showTagDropdown)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-600"
                        >
                            <HiPlus className="w-5 h-5 text-slate-300" />
                        </button>
                    )}
                </div>

                {showSuggestions && showTagDropdown && filteredTags.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagSelect(tag)}
                                className="w-full text-left px-4 py-2 hover:bg-slate-600 text-slate-200 text-sm"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {helperText && (
                <p className="text-xs text-slate-400 mt-1">
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
    helperText: PropTypes.string,
    showSuggestions: PropTypes.bool
};
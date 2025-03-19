import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';

export const SEOSection = ({ data, onChange }) => {
    const [newKeyword, setNewKeyword] = useState('');

    const handleAddKeyword = (e) => {
        e.preventDefault(); // Prevent form submission
        if (newKeyword.trim()) {
            const updatedKeywords = [...(data.seo?.palabrasClave || []), newKeyword.trim()];
            onChange('seo', {
                ...data.seo,
                palabrasClave: updatedKeywords
            });
            setNewKeyword('');
        }
    };

    const handleRemoveKeyword = (indexToRemove) => {
        const updatedKeywords = data.seo?.palabrasClave.filter((_, index) => index !== indexToRemove);
        onChange('seo', {
            ...data.seo,
            palabrasClave: updatedKeywords
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">SEO</h2>
            <div className="space-y-4">
                {/* Palabras Clave */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Palabras Clave
                    </label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            placeholder="Agregar palabra clave"
                        />
                        <button
                            type="button" // Change to type="button" to prevent form submission
                            onClick={handleAddKeyword}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Agregar
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.seo?.palabrasClave?.map((keyword, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-200"
                            >
                                {keyword}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(index)}
                                    className="text-slate-400 hover:text-red-400"
                                >
                                    <HiX className="w-4 h-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
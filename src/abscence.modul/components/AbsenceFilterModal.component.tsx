import { useState } from 'react';
import { X, Filter } from 'lucide-react';

interface AbsenceFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: { typeAbsence: string; periode: string }) => void;
    initialFilters?: { typeAbsence: string; periode: string };
}

const AbsenceFilterModal = ({
    isOpen,
    onClose,
    onApply,
    initialFilters = { typeAbsence: '', periode: '' }
}: AbsenceFilterModalProps) => {
    const [typeAbsence, setTypeAbsence] = useState(initialFilters.typeAbsence);
    const [periode, setPeriode] = useState(initialFilters.periode);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isPeriodeDropdownOpen, setIsPeriodeDropdownOpen] = useState(false);

    const handleApply = () => {
        onApply({ typeAbsence, periode });
        setIsTypeDropdownOpen(false);
        setIsPeriodeDropdownOpen(false);
        onClose();
    };

    const handleReset = () => {
        setTypeAbsence('');
        setPeriode('');
        setIsTypeDropdownOpen(false);
        setIsPeriodeDropdownOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Filter size={24} className="text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Filtrer les absences
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                        <X size={20} className="text-gray-900 dark:text-white" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="space-y-6">
                    {/* Type d'absence */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 text-left dark:text-gray-300 mb-3">
                            Type d'absence
                        </label>
                        <div className="relative cursor-pointer">
                            <button
                                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                className="w-full flex items-center justify-between space-x-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300 text-left">
                                    {typeAbsence === '' && 'Selectionner un type d\'absence'}
                                    {typeAbsence === 'conges' && 'Congés payés'}
                                    {typeAbsence === 'maladie' && 'Maladie'}
                                    {typeAbsence === 'formation' && 'Formation'}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {isTypeDropdownOpen && (
                                <div className="absolute z-50 w-full top-full mt-1 flex flex-col bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setTypeAbsence('');
                                            setIsTypeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Selectionner un type d'absence
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTypeAbsence('conges');
                                            setIsTypeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Congés
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTypeAbsence('maladie');
                                            setIsTypeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Maladie
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTypeAbsence('formation');
                                            setIsTypeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Formation
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Période */}
                    <div>
                        <label className="block text-sm font-semibold text-left text-gray-700 dark:text-gray-300 mb-3">
                            Période
                        </label>
                        <div className="relative cursor-pointer">
                            <button
                                onClick={() => setIsPeriodeDropdownOpen(!isPeriodeDropdownOpen)}
                                className="w-full flex items-center justify-between space-x-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300 text-left">
                                    {periode === '' && 'Tous les mois'}
                                    {periode === 'janvier' && 'Janvier'}
                                    {periode === 'fevrier' && 'Février'}
                                    {periode === 'mars' && 'Mars'}
                                    {periode === 'avril' && 'Avril'}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${isPeriodeDropdownOpen ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {isPeriodeDropdownOpen && (
                                <div className="absolute z-50 w-full top-full mt-1 flex flex-col bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setPeriode('');
                                            setIsPeriodeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Tous les mois
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPeriode('janvier');
                                            setIsPeriodeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Janvier
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPeriode('fevrier');
                                            setIsPeriodeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Février
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPeriode('mars');
                                            setIsPeriodeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 transition-colors"
                                    >
                                        Mars
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPeriode('avril');
                                            setIsPeriodeDropdownOpen(false);
                                        }}
                                        className="py-2 px-4 text-left font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Avril
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                    >
                        Réinitialiser
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                    >
                        Appliquer
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AbsenceFilterModal;

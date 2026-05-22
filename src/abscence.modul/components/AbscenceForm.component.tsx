import { useState } from 'react';
import { X } from 'lucide-react';

interface AbscenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AbsenceForm = ({ isOpen, onClose }: AbscenceFormModalProps) => {
  const [formData, setFormData] = useState({
    dateDemandee: '',
    motif: '',
    typeAbsence: 'conges',
    priorite: 'normale'
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Demande d\'absence:', formData);
    // Ici vous pouvez ajouter la logique d'envoi à votre API
    alert('Demande d\'absence enregistrée avec succès!');
    // Réinitialiser le formulaire
    setFormData({
      dateDemandee: '',
      motif: '',
      typeAbsence: 'conges',
      priorite: 'normale'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Demande d'absence
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Date demandée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date demandée
              </label>
              <input
                type="date"
                name="dateDemandee"
                value={formData.dateDemandee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Motif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Motif
              </label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Décrivez le motif de votre absence..."
                required
              />
            </div>

            {/* Type d'absence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'absence
              </label>
              <select
                name="typeAbsence"
                value={formData.typeAbsence}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="conges">Congés payés</option>
                <option value="maladie">Maladie</option>
                <option value="personnel">Raison personnelle</option>
                <option value="formation">Formation</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                name="priorite"
                value={formData.priorite}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbsenceForm;
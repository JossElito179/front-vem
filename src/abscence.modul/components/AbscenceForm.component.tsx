import React, { useState } from 'react';

const AbsenceForm = () => {
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
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Demande d'absence</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Date demandée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date demandée
            </label>
            <input
              type="date"
              name="dateDemandee"
              value={formData.dateDemandee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif
            </label>
            <textarea
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Décrivez le motif de votre absence..."
              required
            />
          </div>

          {/* Type d'absence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'absence
            </label>
            <select
              name="typeAbsence"
              value={formData.typeAbsence}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              name="priorite"
              value={formData.priorite}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="basse">Basse</option>
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AbsenceForm;
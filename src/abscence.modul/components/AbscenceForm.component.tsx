import { useState, useEffect } from "react";
import { X } from "lucide-react";

import {
  createAbsenceDemand,
  getAbsenceConfigs,
  type AbsenceConfig,
} from "../absence.service";

interface AbscenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
}

const AbsenceForm = ({ isOpen, onClose, selectedDate }: AbscenceFormModalProps) => {
  const [configs, setConfigs] = useState<AbsenceConfig[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dateDebutAbsence: "",
    dateFin: "",
    motif: "",
    idConfigAbsence: "",
    typeJournee: "JOURNEE",
    priorite: "NORMALE",
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        dateDebutAbsence: selectedDate,
        dateFin: selectedDate,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadConfigs = async () => {
      setIsLoadingConfigs(true);

      try {
        const response = await getAbsenceConfigs();
        setConfigs(response.filter((config) => config.estActif));
        if (response.length > 0) {
          setFormData((prev) => ({
            ...prev,
            idConfigAbsence: prev.idConfigAbsence || String(response[0].id),
          }));
        }
      } finally {
        setIsLoadingConfigs(false);
      }
    };

    void loadConfigs();
  }, [isOpen]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formData.idConfigAbsence) {
      alert("Veuillez sélectionner un type d'absence.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createAbsenceDemand({
        idConfigAbsence: Number(formData.idConfigAbsence),
        dateDebutAbsence: formData.dateDebutAbsence,
        dateFinAbsence: formData.dateFin,
        typeJournee: formData.typeJournee as "JOURNEE" | "MATIN" | "APRES_MIDI",
        priorite: formData.priorite as "BASSE" | "NORMALE" | "HAUTE",
        motif: formData.motif,
      });

      alert("Demande d'absence enregistrée avec succès!");
      setFormData({
        dateDebutAbsence: "",
        dateFin: "",
        motif: "",
        idConfigAbsence: "",
        typeJournee: "JOURNEE",
        priorite: "NORMALE",
      });
      onClose();
    } catch {
      alert("Impossible d'enregistrer la demande d'absence.");
    } finally {
      setIsSubmitting(false);
    }
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
            className="p-2 rounded-full  text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Dates Container - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date debut */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date début
                </label>
                <input
                  type="date"
                  name="dateDebutAbsence"
                  value={formData.dateDebutAbsence}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>


              {/* Date fin */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date fin
                </label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            {/* Motif */}
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'absence
              </label>
              <select
                name="idConfigAbsence"
                value={formData.idConfigAbsence}
                onChange={handleChange}
                disabled={isLoadingConfigs}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">{isLoadingConfigs ? "Chargement..." : "Choisir un type"}</option>
                {configs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.libelle} ({config.typeAbsence})
                  </option>
                ))}
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                name="priorite"
                value={formData.priorite}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="BASSE">Basse</option>
                <option value="NORMALE">Normale</option>
                <option value="HAUTE">Haute</option>
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
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? "Envoi..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbsenceForm;

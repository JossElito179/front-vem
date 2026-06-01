import { useState, useEffect } from "react";
import { X, Calendar, FileText, Clock, AlertCircle, ChevronDown, Loader2, CheckCircle2, Check } from "lucide-react";

import {
  createAbsenceDemand,
  getAbsenceConfigs,
  type AbsenceConfig,
} from "../absence.service";
import { useToast } from "../../components/Toast";

interface AbscenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  onSuccess?: () => void;
}

const AbsenceForm = ({ isOpen, onClose, selectedDate, onSuccess }: AbscenceFormModalProps) => {
  const toast = useToast();
  const [configs, setConfigs] = useState<AbsenceConfig[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    dateDebutAbsence: "",
    dateFin: "",
    motif: "",
    idConfigAbsence: "",
    typeJournee: "JOURNEE",
    priorite: "NORMALE",
  });

  const prioriteColors = {
    BASSE: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/30',
    NORMALE: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/30',
    HAUTE: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/30',
  };

  const prioriteLabels = {
    BASSE: 'Basse',
    NORMALE: 'Normale',
    HAUTE: 'Haute',
  };

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

    // Validation des champs requis
    if (!formData.dateDebutAbsence) {
      toast.error("Veuillez sélectionner une date de début.");
      return;
    }

    if (!formData.dateFin) {
      toast.error("Veuillez sélectionner une date de fin.");
      return;
    }

    if (!formData.idConfigAbsence) {
      toast.error("Veuillez sélectionner un type d'absence.");
      return;
    }

    if (!formData.motif.trim()) {
      toast.error("Veuillez entrer un motif.");
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

      toast.success("Demande enregistrée avec succès!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          dateDebutAbsence: "",
          dateFin: "",
          motif: "",
          idConfigAbsence: "",
          typeJournee: "JOURNEE",
          priorite: "NORMALE",
        });
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Impossible d'enregistrer la demande d'absence.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden transition-all duration-300">

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-inherit rounded-2xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Demande enregistrée !</p>
          </div>
        )}

        {/* Header with gradient accent */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          {/* <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-white via-gray-500 to-black" /> */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-500/20">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Demande d'absence
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Remplissez le formulaire ci-dessous
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 hover:rotate-90"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Dates Container - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date debut */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={14} className="text-blue-500 dark:text-blue-400" />
                  Date début
                </label>
                <input
                  type="date"
                  name="dateDebutAbsence"
                  value={formData.dateDebutAbsence}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl transition-all duration-200 outline-none"
                  
                />
              </div>

              {/* Date fin */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={14} className="text-blue-500 dark:text-blue-400" />
                  Date fin
                </label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl transition-all duration-200 outline-none"
                  
                />
              </div>
            </div>

            {/* Type d'absence */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <AlertCircle size={14} className="text-amber-500 dark:text-amber-400" />
                Type d'absence
              </label>
              <div className="relative">
                <select
                  name="idConfigAbsence"
                  value={formData.idConfigAbsence}
                  onChange={handleChange}
                  disabled={isLoadingConfigs}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl transition-all duration-200 outline-none appearance-none cursor-pointer disabled:opacity-50"
                >
                  {configs.map((config) => (
                    <option key={config.id} value={config.id} className="bg-white text-gray-900 dark:bg-slate-800 dark:text-white">
                      {config.libelle} — {config.typeAbsence}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" />
                {isLoadingConfigs && (
                  <Loader2 size={16} className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-gray-500 dark:text-gray-400" />
                )}
              </div>
            </div>

            {/* Type de journée */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock size={14} className="text-cyan-500 dark:text-cyan-400" />
                Type de journée
              </label>
              <div className="relative">
                <select
                  name="typeJournee"
                  value={formData.typeJournee}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl  transition-all duration-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="JOURNEE" className="bg-white text-gray-900 dark:bg-slate-800 dark:text-white">Journée complète</option>
                  <option value="MATIN" className="bg-white text-gray-900 dark:bg-slate-800 dark:text-white">Matin uniquement</option>
                  <option value="APRES_MIDI" className="bg-white text-gray-900 dark:bg-slate-800 dark:text-white">Après-midi uniquement</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Priorité - Chip style */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <AlertCircle size={14} className="text-rose-500 dark:text-rose-400" />
                Priorité
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['BASSE', 'NORMALE', 'HAUTE'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priorite: p }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      formData.priorite === p
                        ? prioriteColors[p] + ' ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-slate-600 dark:text-gray-400 dark:hover:border-slate-500 dark:hover:text-gray-300'
                    }`}
                  >
                    {prioriteLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Motif */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={14} className="text-purple-500 dark:text-purple-400" />
                Motif
              </label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Décrivez le motif de votre absence..."
                
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-gray-300 dark:border-gray-600 flex-1 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 bg-linear-to-r from-gray-900 to-gray-100 hover:from-gray-800 hover:to-gray-50 dark:from-white dark:to-gray-900 dark:text-gray-900 dark:hover:from-gray-100 dark:hover:to-gray-800"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} />
                    Enregistrer
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbsenceForm;
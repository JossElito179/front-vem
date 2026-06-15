import { useEffect, useState } from "react";

import AbsenceForm from "./AbscenceForm.component";
import AbsenceFilterModal from "./AbsenceFilterModal.component";
import FilterBar from "./FilterBar.component";
import {
  getMyAbsenceRequests,
  getTeamAbsenceRequests,
  updateAbsenceValidation,
  type AbsenceRequest,
} from "../absence.service";
import AbscenceTable, { type AbsenceTableRow } from "./AbscenceTable.component";
import Calendar from "../../components/calendar";
import BigCalendar from "../../components/BigCalendar";
import { FaCalendarDays } from "react-icons/fa6";
import { useAuth } from "../../auth.modul/AuthProvider";

const AbscenceListComponent = () => {
  const { user } = useAuth();
  const isManager = user?.permissions?.includes('VALIDER_CONGE') ?? false;

  const [isAbsenceFormModalOpen, setIsAbsenceFormModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ typeAbsence: "", periode: "" });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'mine' | 'team'>('mine');
  const [rows, setRows] = useState<AbsenceTableRow[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [isBigCalendarOpen, setIsBigCalendarOpen] = useState(false);

  const mapRequest = (request: AbsenceRequest): AbsenceTableRow => ({
    absenceId: request.id,
    date: request.dateDebutAbsence,
    type:
      request.configAbsence?.libelle ??
      request.configAbsence?.typeAbsence ??
      String(request.idConfigAbsence),
    motifs: request.motif ?? "-",
    status: request.statut,
    demandeur: request.demandeur
      ? `${request.demandeur.prenom} ${request.demandeur.nom}`
      : undefined,
  });

  const loadAbsences = async () => {
    setIsLoadingRows(true);
    try {
      const response =
        activeTab === 'team' && isManager
          ? await getTeamAbsenceRequests()
          : await getMyAbsenceRequests();
      setRows(response.map(mapRequest));
    } catch {
      setRows([]);
    } finally {
      setIsLoadingRows(false);
    }
  };

  useEffect(() => {
    void loadAbsences();
  }, [activeTab]);

  const handleValidate = async (id: number, statut: 'VALIDE' | 'REFUSE') => {
    try {
      await updateAbsenceValidation(id, { statut });
      void loadAbsences();
    } catch {
      // silent — could add a toast here
    }
  };

  const absenceTypes = [
    { id: "CONGES", label: "Congés" },
    { id: "OFF", label: "Off" },
  ];

  const periods = [
    { id: "JOURNEE", label: "Journée" },
    { id: "DEMI-JOURNEE", label: "Demi-journée" },
  ];

  const handleFilterChange = (
    filterType: "typeAbsence" | "periode",
    value: string,
    isChecked: boolean,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: isChecked ? value : "",
    }));
  };

  return (
    <>
      <div className="w-full overflow-hidden">
        <div className="flex w-full h-auto gap-6 px-2 sm:px-4">
          {/* partie gauche w-20% (filter checkbox) */}
          <div className="hidden md:flex flex-col w-1/5 gap-6 pr-2 border rounded-lg border-gray-200 dark:border-gray-700 p-3 min-w-min">
            {/* Type d'absence filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-left">
                Type d'absence
              </h3>
              <div className="space-y-2">
                {absenceTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.typeAbsence === type.id}
                      onChange={(e) =>
                        handleFilterChange(
                          "typeAbsence",
                          type.id,
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-500">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Période filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-left">
                Période
              </h3>
              <div className="space-y-2">
                {periods.map((period) => (
                  <label
                    key={period.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.periode === period.id}
                      onChange={(e) =>
                        handleFilterChange(
                          "periode",
                          period.id,
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-500">
                      {period.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* partie droite w-80% (table and filter modal) */}
          <div className="flex flex-col gap-6 w-full md:w-4/5 min-w-0 overflow-x-auto">
            <div className="flex md:hidden items-center justify-between">
              <FilterBar
                filters={filters}
                onFilterClick={() => setIsFilterModalOpen(true)}
              />
            </div>

            {isManager && (
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('mine')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'mine'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Mes demandes
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'team'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Demandes de l'équipe
                </button>
              </div>
            )}

            <AbscenceTable
              rows={rows}
              isLoadingRows={isLoadingRows}
              onValidate={activeTab === 'team' && isManager ? handleValidate : undefined}
            />
          </div>

          {/* Modal Formulaire d'absence */}
          <AbsenceForm
            isOpen={isAbsenceFormModalOpen}
            onClose={() => {
              setIsAbsenceFormModalOpen(false);
              setSelectedDate("");
            }}
            selectedDate={selectedDate}
            onSuccess={() => {
              void loadAbsences();
              setIsAbsenceFormModalOpen(false);
              setSelectedDate("");
            }}
          />

          {/* Modal Filtres */}
          <AbsenceFilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={(newFilters) => setFilters(newFilters)}
            initialFilters={filters}
          />
        </div>

        {/* calendar */}
        <div className="mt-20 w-full overflow-hidden px-2 sm:px-4">
          <div className="mb-6 text-left">
            <button 
            onClick={() => setIsBigCalendarOpen(!isBigCalendarOpen)}
            className="px-4 py-2 flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg whitespace-nowrap">
              <FaCalendarDays /> {!isBigCalendarOpen ? `Big calendar` : `Petit calendar`}
            </button>
          </div>
          <div className="w-full overflow-x-auto">
          {isBigCalendarOpen && (
            <BigCalendar
              onDateSelect={(date) => {
                setSelectedDate(date);
                setIsAbsenceFormModalOpen(true);
              }}
            />
          )}
          {!isBigCalendarOpen && (
            <Calendar
              onDateSelect={(date) => {
                setSelectedDate(date);
                setIsAbsenceFormModalOpen(true);
              }}
            />
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AbscenceListComponent;

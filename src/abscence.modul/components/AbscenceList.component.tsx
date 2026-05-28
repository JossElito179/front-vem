import { useEffect, useState } from "react";

import AbsenceForm from "./AbscenceForm.component";
import AbsenceFilterModal from "./AbsenceFilterModal.component";
import FilterBar from "./FilterBar.component";
import { getMyAbsenceRequests, type AbsenceRequest } from "../absence.service";
import AbscenceTable from "./AbscenceTable.component";
import Calendar from "../../components/calendar";
import BigCalendar from "../../components/BigCalendar";
import { FaCalendarDays } from "react-icons/fa6";

const AbscenceListComponent = () => {
  const [isAbsenceFormModalOpen, setIsAbsenceFormModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ typeAbsence: "", periode: "" });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [rows, setRows] = useState<
    Array<{ date: string; type: string; motifs: string; status: string }>
  >([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [isBigCalendarOpen, setIsBigCalendarOpen] = useState(false);

  const loadAbsences = async () => {
    setIsLoadingRows(true);

    try {
      const response = await getMyAbsenceRequests();

      setRows(
        response.map((request: AbsenceRequest) => ({
          date: request.dateDebutAbsence,
          type:
            request.configAbsence?.libelle ??
            request.configAbsence?.typeAbsence ??
            String(request.idConfigAbsence),
          motifs: request.motif ?? "-",
          status: request.statut,
        })),
      );
    } catch {
      setRows([]);
    } finally {
      setIsLoadingRows(false);
    }
  };

  useEffect(() => {
    void loadAbsences();
  }, []);

  const absenceTypes = [
    { id: "CONGES", label: "Congés" },
    { id: "MALADIE", label: "Maladie" },
    { id: "FORMATION", label: "Formation" },
    { id: "AUTRE", label: "Autre" },
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
      <div>
        <div className="flex w-full h-auto gap-6">
          {/* partie gauche w-20% (filter checkbox) */}
          <div className="hidden md:flex flex-col w-1/5 gap-6 pr-4 border rounded-lg border-gray-200 dark:border-gray-700 p-3">
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
          <div className="flex flex-col gap-6 w-full md:w-4/5">
            <div className="flex md:hidden items-center justify-between">
              <FilterBar
                filters={filters}
                onFilterClick={() => setIsFilterModalOpen(true)}
              />
            </div>

            <AbscenceTable rows={rows} isLoadingRows={isLoadingRows} />
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
        <div className="mt-20">
          <div className="mb-6 text-left">
            <button 
            onClick={() => setIsBigCalendarOpen(!isBigCalendarOpen)}
            className="px-4 py-2 flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg">
              <FaCalendarDays /> {!isBigCalendarOpen ? `Big calendar` : `Petit calendar`}
            </button>
          </div>
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
    </>
  );
};

export default AbscenceListComponent;

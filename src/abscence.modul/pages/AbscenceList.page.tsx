import { useState } from "react";
import AbscenceListComponent from "../components/AbscenceList.component";
import InsideSidebar from "../../templates.component/InsideSidebar.component";
import AbsenceForm from "../components/AbscenceForm.component";
import { MdOutlineNoteAdd } from "react-icons/md";

const AbscenceListes = () => {
  const [isAbsenceFormModalOpen, setIsAbsenceFormModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <InsideSidebar>
      <div className="bg-transparent dark:bg-transparent rounded-t-xl border-t border-l border-r border-gray-200 dark:border-gray-800 p-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des absences
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Visualisez vos absences et sélectionnez des dates
            </p>
          </div>
          <button 
            onClick={() => setIsAbsenceFormModalOpen(true)}
            className="mb-18 px-4 py-2 bg-gray-800 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-900 flex items-center justify-center md:justify-start gap-3 text-white rounded-lg font-medium transition-colors">
            <MdOutlineNoteAdd size={22} />
            <span className="hidden md:inline">Demande d'absence</span>
          </button>
        </div>
        <AbscenceListComponent />

        {/* Big calendar */}
        <div className="mt-20"></div>

        {/* big calendar */}
        {/* <BigCalendar onDateSelect={handleCalendarDateSelect} /> */}

        {/* Modal Formulaire d'absence */}
        <AbsenceForm
          isOpen={isAbsenceFormModalOpen}
          onClose={() => {
            setIsAbsenceFormModalOpen(false);
            setSelectedDate("");
          }}
          selectedDate={selectedDate}
        />
      </div>
    </InsideSidebar>
  );
};

export default AbscenceListes;

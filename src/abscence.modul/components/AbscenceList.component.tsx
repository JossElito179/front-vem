import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import AbsenceForm from "./AbscenceForm.component";
import AbsenceFilterModal from "./AbsenceFilterModal.component";
import FilterBar from "./FilterBar.component";
import Calendar from "../../components/calendar";
import { getMyAbsenceRequests, type AbsenceRequest } from "../absence.service";
import { MdOutlineNoteAdd } from "react-icons/md";

const AbscenceListComponent = () => {
  const [isAbsenceFormModalOpen, setIsAbsenceFormModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ typeAbsence: "", periode: "" });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<
    Array<{ date: string; type: string; motifs: string; status: string }>
  >([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const rowsPerPage = 5;

  const handleCalendarDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsAbsenceFormModalOpen(true);
  };

  useEffect(() => {
    const loadRows = async () => {
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

    void loadRows();
  }, []);

  // Filter rows based on search term
  const filteredRows = rows.filter(
    (row) =>
      row.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.motifs.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Historique (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header with buttons */}
          <div className="flex items-center justify-between">
            <FilterBar
              filters={filters}
              onFilterClick={() => setIsFilterModalOpen(true)}
            />

            <button
              onClick={() => setIsAbsenceFormModalOpen(true)}
              className="px-4 py-2 bg-gray-800 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-900 flex items-center gap-3 text-white rounded-lg font-medium transition-colors"
            >
              <MdOutlineNoteAdd size={22} />
              Demande d'absence
            </button>
          </div>

          {/* Table Section */}
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto hide-scrollbar">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="border rounded-lg divide-y divide-gray-200 border-gray-200 dark:border-gray-700 dark:divide-gray-700">
                  {/* Search Bar */}
                  <div className="py-3 px-4">
                    <div className="relative max-w-xs">
                      <label className="sr-only">Rechercher</label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        placeholder="Rechercher..."
                      />
                      <div className="absolute inset-y-0 inset-s-0 flex items-center pointer-events-none ps-3">
                        <Search size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                          >
                            Motifs
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                          >
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoadingRows ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                              Chargement des demandes d'absence...
                            </td>
                          </tr>
                        ) : paginatedRows.length > 0 ? (
                          paginatedRows.map((row) => (
                          <tr
                            key={row.date}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-800 dark:text-gray-200">
                              {row.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                {row.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-800 dark:text-gray-200">
                              {row.motifs}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-end  text-sm">
                              <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                              Aucune demande d'absence trouvée.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pagination Controls */}
                <div className="py-4 px-4">
                  <div className="inline-flex rounded-xl">
                    <ul className="flex items-center">
                      <li className="px-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400 transition-colors"
                        >
                          <svg
                            width="8"
                            height="15"
                            viewBox="0 0 8 15"
                            className="fill-current stroke-current"
                          >
                            <path
                              d="M7.12979 1.91389L7.1299 1.914L7.1344 1.90875C7.31476 1.69833 7.31528 1.36878 7.1047 1.15819C7.01062 1.06412 6.86296 1.00488 6.73613 1.00488C6.57736 1.00488 6.4537 1.07206 6.34569 1.18007L6.34564 1.18001L6.34229 1.18358L0.830207 7.06752C0.830152 7.06757 0.830098 7.06763 0.830043 7.06769C0.402311 7.52078 0.406126 8.26524 0.827473 8.73615L0.827439 8.73618L0.829982 8.73889L6.34248 14.6014L6.34243 14.6014L6.34569 14.6047C6.546 14.805 6.88221 14.8491 7.1047 14.6266C7.30447 14.4268 7.34883 14.0918 7.12833 13.8693L1.62078 8.01209C1.55579 7.93114 1.56859 7.82519 1.61408 7.7797L1.61413 7.77975L1.61729 7.77639L7.12979 1.91389Z"
                              strokeWidth="0.3"
                            ></path>
                          </svg>
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li key={page} className="px-2">
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-9 h-9 rounded-md border transition-colors ${
                                currentPage === page
                                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400"
                              }`}
                            >
                              {page}
                            </button>
                          </li>
                        ),
                      )}

                      <li className="px-2">
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400 transition-colors"
                        >
                          <svg
                            width="8"
                            height="15"
                            viewBox="0 0 8 15"
                            className="fill-current stroke-current"
                          >
                            <path
                              d="M0.870212 13.0861L0.870097 13.086L0.865602 13.0912C0.685237 13.3017 0.684716 13.6312 0.895299 13.8418C0.989374 13.9359 1.13704 13.9951 1.26387 13.9951C1.42264 13.9951 1.5463 13.9279 1.65431 13.8199L1.65436 13.82L1.65771 13.8164L7.16979 7.93248C7.16985 7.93243 7.1699 7.93237 7.16996 7.93231C7.59769 7.47923 7.59387 6.73477 7.17253 6.26385L7.17256 6.26382L7.17002 6.26111L1.65752 0.398611L1.65757 0.398563L1.65431 0.395299C1.454 0.194997 1.11779 0.150934 0.895299 0.373424C0.695526 0.573197 0.651169 0.908167 0.871667 1.13067L6.37922 6.98791C6.4442 7.06886 6.43141 7.17481 6.38592 7.2203L6.38587 7.22025L6.38271 7.22361L0.870212 13.0861Z"
                              strokeWidth="0.3"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Calendrier (1/3) */}
        <div className="lg:col-span-1">
          <div className="flex w-full justify-center mt-17">
            <Calendar onDateSelect={handleCalendarDateSelect} />
          </div>
        </div>
      </div>

      {/* Modal Formulaire d'absence */}
      <AbsenceForm
        isOpen={isAbsenceFormModalOpen}
        onClose={() => {
          setIsAbsenceFormModalOpen(false);
          setSelectedDate("");
        }}
        selectedDate={selectedDate}
      />

      {/* Modal Filtres */}
      <AbsenceFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        initialFilters={filters}
      />
    </div>
  );
};

export default AbscenceListComponent;

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LuListFilter } from "react-icons/lu";

export type AbsenceTableRow = {
  absenceId: number;
  date: string;
  type: string;
  motifs: string;
  status: string;
  demandeur?: string;
};

type AbscenceTableProps = {
  rows: AbsenceTableRow[];
  isLoadingRows?: boolean;
  onValidate?: (id: number, statut: 'VALIDE' | 'REFUSE') => void;
};

const rowsPerPage = 5;

const AbscenceTable = ({ rows, isLoadingRows = false, onValidate }: AbscenceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.motifs.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [rows, searchTerm],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="w-full">
        <div className="p-1.5 w-full">
          <div className="border rounded-lg divide-y divide-gray-200 border-gray-200 dark:border-gray-700 dark:divide-gray-700">
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

            <div className="overflow-auto hdie-scrollbar">
              <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {onValidate && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                      >
                        Demandeur
                      </th>
                    )}
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
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoadingRows ? (
                    <tr>
                      <td
                        colSpan={onValidate ? 6 : 5}
                        className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        Chargement des demandes d'absence...
                      </td>
                    </tr>
                  ) : paginatedRows.length > 0 ? (
                    paginatedRows.map((row) => (
                      <tr
                        key={row.absenceId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {onValidate && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-800 dark:text-gray-200">
                            {row.demandeur ?? '—'}
                          </td>
                        )}
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
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            row.status === 'VALIDE'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : row.status === 'REFUSE'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm">
                          {onValidate && row.status === 'ATTENTE' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onValidate(row.absenceId, 'VALIDE')}
                                className="cursor-pointer px-2.5 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => onValidate(row.absenceId, 'REFUSE')}
                                className="cursor-pointer px-2.5 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium"
                              >
                                Refuser
                              </button>
                            </div>
                          ) : (
                            <button className="cursor-pointer px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-900/30 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium">
                              <LuListFilter />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={onValidate ? 6 : 5}
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

          <div className="py-4 px-4">
            <div className="inline-flex rounded-xl">
              <ul className="flex items-center">
                <li className="px-2">
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
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
                      />
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
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
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
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbscenceTable;

import { Filter } from "lucide-react";

interface FilterBarProps {
  filters: {
    typeAbsence: string;
    periode: string;
  };
  onFilterClick: () => void;
}

const FilterBar = ({ filters, onFilterClick }: FilterBarProps) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onFilterClick}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition-colors font-medium"
      >
        <Filter size={18} />
        Filtrer
      </button>
      {(filters.typeAbsence || filters.periode) && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.typeAbsence && (
            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
              Type: {filters.typeAbsence}
            </span>
          )}
          {filters.periode && (
            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
              Période: {filters.periode}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

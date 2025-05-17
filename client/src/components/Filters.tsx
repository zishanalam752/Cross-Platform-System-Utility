import React from 'react';

interface Props {
  filters: {
    osType: string;
    hasIssues: boolean;
  };
  onFilterChange: (filters: any) => void;
}

const Filters: React.FC<Props> = ({ filters, onFilterChange }) => {
  return (
    <div className="filters">
      <select
        value={filters.osType}
        onChange={(e) => onFilterChange({ ...filters, osType: e.target.value })}
      >
        <option value="">All OS Types</option>
        <option value="Windows">Windows</option>
        <option value="Darwin">macOS</option>
        <option value="Linux">Linux</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={filters.hasIssues}
          onChange={(e) => onFilterChange({ ...filters, hasIssues: e.target.checked })}
        />
        Show only machines with issues
      </label>
    </div>
  );
};

export default Filters; 
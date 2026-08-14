const FilterSidebar = ({ filters, updateFilter, clearFilters }) => {
  const categories = ['Jobs', 'Internships', 'Freelancing', 'Hackathons', 'Scholarships'];
  const locations = ['Remote', 'Hybrid', 'Onsite'];
  const workModes = ['Remote', 'Hybrid', 'Onsite'];

  return (
    <div className="bg-white rounded-2xl border border-[#DDE5EA] p-6 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DDE5EA]">
        <h3 className="font-extrabold text-[#111827] font-display text-base">Filter Opportunities</h3>
        <button onClick={clearFilters} className="text-xs text-[#1677C8] font-extrabold uppercase tracking-wider hover:text-[#0B5FA5] cursor-pointer">
          Clear all
        </button>
      </div>

      <div className="mb-6">
        <h4 className="font-extrabold text-[#111827] mb-3 text-xs uppercase tracking-wider">Category</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => updateFilter('category', filters.category === cat ? '' : cat)}
                className="h-4 w-4 border-[#DDE5EA] text-[#1677C8] focus:ring-[#1677C8]"
              />
              <span className={`text-sm font-semibold transition-colors ${filters.category === cat ? 'text-[#1677C8] font-extrabold' : 'text-[#475569] group-hover:text-[#111827]'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-extrabold text-[#111827] mb-3 text-xs uppercase tracking-wider">Location</h4>
        <div className="space-y-2.5">
          {locations.map((loc) => (
            <label key={loc} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="location"
                checked={filters.locationType === loc.toLowerCase()}
                onChange={() => updateFilter('locationType', filters.locationType === loc.toLowerCase() ? '' : loc.toLowerCase())}
                className="h-4 w-4 border-[#DDE5EA] text-[#1677C8] focus:ring-[#1677C8]"
              />
              <span className={`text-sm font-semibold capitalize transition-colors ${filters.locationType === loc.toLowerCase() ? 'text-[#1677C8] font-extrabold' : 'text-[#475569] group-hover:text-[#111827]'}`}>
                {loc}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-extrabold text-[#111827] mb-3 text-xs uppercase tracking-wider">Work Mode</h4>
        <select
          value={filters.workMode || ''}
          onChange={(e) => updateFilter('workMode', e.target.value)}
          className="form-input w-full text-sm font-medium"
        >
          <option value="">All modes</option>
          {workModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <h4 className="font-extrabold text-[#111827] mb-3 text-xs uppercase tracking-wider">Minimum Salary</h4>
        <input
          type="number"
          placeholder="e.g. 50000"
          onChange={(e) => updateFilter('salary', e.target.value)}
          className="form-input w-full text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;

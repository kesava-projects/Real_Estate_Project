function PropertyFilters({ filters, onChange, onSearch }) {
  const handleChange = (e) => {
    onChange({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="glass-card filters-panel">
      <div className="form-grid two-col">
        <div>
          <label htmlFor="search">Search</label>
          <input
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="City, title, address..."
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Hyderabad"
          />
        </div>
        <div>
          <label htmlFor="property_type">Type</label>
          <select
            id="property_type"
            name="property_type"
            value={filters.property_type}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="HOUSE">House</option>
            <option value="LAND">Land</option>
          </select>
        </div>
        <div>
          <label htmlFor="listing_type">Listing</label>
          <select
            id="listing_type"
            name="listing_type"
            value={filters.listing_type}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="BUY">Buy</option>
            <option value="RENT">Rent</option>
          </select>
        </div>
        <div>
          <label htmlFor="price_min">Min price</label>
          <input
            id="price_min"
            type="number"
            name="price_min"
            value={filters.price_min}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price_max">Max price</label>
          <input
            id="price_max"
            type="number"
            name="price_max"
            value={filters.price_max}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={onSearch}>
        Apply filters
      </button>
    </div>
  );
}

export default PropertyFilters;

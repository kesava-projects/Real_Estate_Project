const emptyForm = {
  title: "",
  description: "",
  price: "",
  property_type: "HOUSE",
  listing_type: "BUY",
  bedrooms: "",
  bathrooms: "",
  area_sqft: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export const getEmptyPropertyForm = () => ({ ...emptyForm });

function PropertyForm({ data, onChange, onSubmit, submitLabel, imageSlot }) {
  const handleChange = (e) => {
    onChange({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="glass-card property-form" onSubmit={onSubmit}>
      <div className="form-grid two-col">
        <div className="full-width">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="Luxury 3BHK Apartment"
            required
          />
        </div>

        <div className="full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Describe the property..."
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            type="number"
            name="price"
            value={data.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="property_type">Property type</label>
          <select
            id="property_type"
            name="property_type"
            value={data.property_type}
            onChange={handleChange}
          >
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="HOUSE">House</option>
            <option value="LAND">Land</option>
          </select>
        </div>

        <div>
          <label htmlFor="listing_type">Listing type</label>
          <select
            id="listing_type"
            name="listing_type"
            value={data.listing_type}
            onChange={handleChange}
          >
            <option value="BUY">Buy</option>
            <option value="RENT">Rent</option>
          </select>
        </div>

        <div>
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            id="bedrooms"
            type="number"
            name="bedrooms"
            value={data.bedrooms}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            id="bathrooms"
            type="number"
            name="bathrooms"
            value={data.bathrooms}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="area_sqft">Area (sqft)</label>
          <input
            id="area_sqft"
            type="number"
            name="area_sqft"
            value={data.area_sqft}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="pincode">Pincode</label>
          <input
            id="pincode"
            name="pincode"
            value={data.pincode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="full-width">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={data.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={data.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            value={data.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {imageSlot}

      <button type="submit" className="btn btn-primary form-submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;

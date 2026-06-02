import { useState } from "react";
import { createProperty } from "../services/propertyService";
import { uploadPropertyImage } from "../services/imageService";

function CreateProperty() {

const [preview, setPreview] = useState(null);
const [image, setImage] = useState(null);
 const [data, setData] = useState({

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
    pincode: ""

  });

  const handleChange = (e) => {

    setData({
      ...data,
      [e.target.name]:
      e.target.value
    });

  };

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const response = await createProperty(data);
    const propertyId = response.data.id;
    console.log(response.data);

      if (image) {

      await uploadPropertyImage(
        propertyId,
        image
      );

    }

    alert("Property Created Successfully");

    setData({
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
      pincode: ""
    });

  } catch (error) {

    console.log("Backend Error:");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error);
    }

  }
};

  return (

    <form
  className="create-form"
  onSubmit={handleSubmit}
>

  <h2>Create Property Listing</h2>

  <input
    type="text"
    name="title"
    placeholder="Property Title"
    value={data.title}
    onChange={handleChange}
    required
  />

  <textarea
    name="description"
    placeholder="Property Description"
    value={data.description}
    onChange={handleChange}
    required
  />

  <input
    type="number"
    name="price"
    placeholder="Price"
    value={data.price}
    onChange={handleChange}
    required
  />

  <select
    name="property_type"
    value={data.property_type}
    onChange={handleChange}
  >
    <option value="APARTMENT">Apartment</option>
    <option value="VILLA">Villa</option>
    <option value="HOUSE">House</option>
    <option value="LAND">Land</option>
  </select>

  <select
    name="listing_type"
    value={data.listing_type}
    onChange={handleChange}
  >
    <option value="BUY">Buy</option>
    <option value="RENT">Rent</option>
  </select>

  <input
    type="number"
    name="bedrooms"
    placeholder="Bedrooms"
    value={data.bedrooms}
    onChange={handleChange}
    required
  />

  <input
    type="number"
    name="bathrooms"
    placeholder="Bathrooms"
    value={data.bathrooms}
    onChange={handleChange}
    required
  />

  <input
    type="number"
    name="area_sqft"
    placeholder="Area (sqft)"
    value={data.area_sqft}
    onChange={handleChange}
    required
  />

  <textarea
    name="address"
    placeholder="Full Address"
    value={data.address}
    onChange={handleChange}
    required
  />

  <input
    type="text"
    name="city"
    placeholder="City"
    value={data.city}
    onChange={handleChange}
    required
  />

  <input
    type="text"
    name="state"
    placeholder="State"
    value={data.state}
    onChange={handleChange}
    required
  />

  <input
    type="text"
    name="pincode"
    placeholder="Pincode"
    value={data.pincode}
    onChange={handleChange}
    required
  />

<input
  type="file"
  accept="image/*"
  onChange={(e) => {

    const file =
      e.target.files[0];

    setImage(file);

    if (file) {

      setPreview(
        URL.createObjectURL(file)
      );

    }
  }}
/>
{
  preview && (
    <img
      src={preview}
      alt="Preview"
      className="preview-image"
    />
  )
}

  <button type="submit">
    Publish Property
  </button>

</form>
  );
}

export default CreateProperty;
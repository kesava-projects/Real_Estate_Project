import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PropertyList from "./pages/PropertyList";
import PropertyDetails from "./pages/PropertyDetails";
import CreateProperty from "./pages/CreateProperty";
import { Navigate } from "react-router-dom";
import MyContacts from "./pages/MyContacts";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <br />
        <br />
      <Routes>

          <Route
  path="/"
  element={<Navigate to="/properties" />}
/>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
    path="/properties"
    element={<PropertyList />}
  />

  <Route
    path="/property/:id"
    element={<PropertyDetails />}
  />

  <Route
    path="/create-property"
    element={<CreateProperty />}
  />

  <Route
  path="/contacts"
  element={<MyContacts />}
/>

<Route path="/wishlist" element={<Wishlist />} />

      </Routes>

    </BrowserRouter>
    );
}

export default App;
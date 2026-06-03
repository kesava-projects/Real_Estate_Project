import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PropertyList from "./pages/PropertyList";
import PropertyDetails from "./pages/PropertyDetails";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";
import MyListings from "./pages/MyListings";
import MyContacts from "./pages/MyContacts";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/properties" replace />} />

          {/* Auth — public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
          />

          {/* Properties — public browse */}
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          {/* Agent property management */}
          <Route
            path="/create-property"
            element={
              <ProtectedRoute roles={["AGENT", "ADMIN"]}>
                <CreateProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/:id/edit"
            element={
              <ProtectedRoute roles={["AGENT", "ADMIN"]}>
                <EditProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute roles={["AGENT", "ADMIN"]}>
                <MyListings />
              </ProtectedRoute>
            }
          />

          {/* Buyer features */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute roles={["BUYER"]}>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Contacts — buyers & agents */}
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <MyContacts />
              </ProtectedRoute>
            }
          />

          {/* Account */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

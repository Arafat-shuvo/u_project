import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AdminUpload from "./pages/AdminUpload";
import ProtectedRoute from "./routes/ProtectedRoute";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen  ">
      <Navbar />
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminUpload />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}

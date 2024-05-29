import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navbar/Navbar";
import Footer from "./pages/Footer";
import { Home } from "./pages/Home";
import { MyCalendar } from "./components/calendar/Calendar";
import ProtectedRoute from "./ProtectedRoute";
import { ProvideAuth } from "./hook/useAuthentication";
import { Admin } from "./pages/Admin";

function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/calendar" exact element={<MyCalendar />} />
          <Route
            path="/admin"
            exact
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;

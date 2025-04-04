import "bootstrap/dist/css/bootstrap.min.css";
import { TimestampProvider } from "./context/TimestampContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Agents from "./pages/Agents";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import NavBar from "./components/NavBar";

function App() {
  return (
    <TimestampProvider>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Overview" element={<Overview />} />
          <Route path="/Agents" element={<Agents />} />
        </Routes>
      </div>
    </TimestampProvider>
  );
}

export default App;

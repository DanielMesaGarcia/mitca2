import { Route, Routes, BrowserRouter } from "react-router-dom";
import './App.css';
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import RaceData from "./pages/RaceData/RaceData";
import RunnersPage from "./pages/Runners/Runners";
import SponsorsPage from "./pages/Sponsors/Sponsors";
import UserSettings from "./pages/userSettings/UserSettings";
import SponsorsCRUD from "./pages/Sponsors/SponsorsCRUD";
import UserCRUD from "./pages/userSettings/userCRUD";
import RunnersCRUD from "./pages/Runners/RunnerCRUD";
import RunnersCRUDuser from "./pages/Runners/RunnerCRUDuser";
import HomeAdmin from "./pages/Home/HomeAdmin";
import RaceDataAdmin from "./pages/RaceData/RaceDataAdmin";
import Report from "./pages/Report/Report";
function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/homeadmin" element={<HomeAdmin/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/racedata/:id" element={<RaceData/>}/>
        <Route path="/racedataAdmin/:id" element={<RaceDataAdmin/>}/>
        <Route path="/runners/:id" element={<RunnersPage/>}/>
        <Route path="/sponsors/:id" element={<SponsorsPage/>}/>
        <Route path="/usersettings" element={<UserSettings/>}/>
        <Route path="/runners" element={<RunnersCRUD/>}/>
        <Route path="/runnersuser" element={<RunnersCRUDuser/>}/>
        <Route path="/sponsors" element={<SponsorsCRUD/>}/>
        <Route path="/users" element={<UserCRUD/>}/>
        <Route path="/report" element={<Report/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
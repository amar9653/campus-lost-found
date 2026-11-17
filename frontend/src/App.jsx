
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import UserDashboard from './pages/user/UserDashboard';
import CreateLostReport from './pages/user/CreateLostReport';
import FoundItemReport from './pages/user/FoundItemReport';
import SearchItems from './pages/user/SearchItems';
import MyClaims from './pages/user/MyClaims';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<UserDashboard />} />

        <Route path="/report-lost" element={<CreateLostReport />} />
        <Route path="/report-found" element={<FoundItemReport />} />
        <Route path="/search" element={<SearchItems />} />
        <Route path="/claims" element={<MyClaims />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

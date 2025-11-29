import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage';
import  RestaurantDetails  from './pages/RestaurantDetails.jsx';
import Profile from './pages/Profile.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/restaurants/:id" element={<RestaurantDetails />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App

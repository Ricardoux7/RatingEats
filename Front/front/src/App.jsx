import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage';
import  RestaurantDetails  from './pages/RestaurantDetails.jsx';
import Profile from './pages/Profile.jsx';
import MyRestaurant from './pages/ManageRestaurant.jsx';
import HandleCreate from './components/ManageRestaurant/CreateRestaurant.jsx';
import NoPermission from './components/ManageRestaurant/NoPermission.jsx';
import { useAuth } from './context/AuthContext.jsx';
import 'animate.css';
function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/restaurants/:id" element={<RestaurantDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/manage/restaurants/create" element={<HandleCreate user={user} />} />
      <Route path="/manage/restaurants/:id" element={<MyRestaurant />} />
      <Route path="/no-permission" element={<NoPermission />} />
    </Routes>
  )
}

export default App

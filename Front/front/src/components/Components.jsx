import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import MyRestaurant from '../pages/ManageRestaurant';
import MyRestaurants from './Profile/MyRestaurants';
import Results from './Search.jsx';
import api from '../api/api.js';

const HeaderMobile = ({ tab, setTab, manage }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  useEffect(() =>{
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  return (
    <header className={`${tab ? 'h-20' : 'h-20'} top-0 left-0 right-0 flex flex-col p-4 border-gray-300 bg-white items-center md:hidden`}>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex items-center min-w-[50px]">
          {manage && <AsideManager setTitle={setTab} />}
        </div>
        <div className={`flex-1 flex justify-center`}>
          <img
            src="/icons/logo2.png"
            alt="RatingEats"
            className="h-20 max-w-[220px] object-contain" 
            onClick={() => navigate('/')}
          />
        </div>
        <div className="flex items-center min-w-auto" ref={menuRef} onClick={() => setShowMenu(!showMenu)}>
          {showMenu && <UserMenu onClose={() => setShowMenu(false)} />}
          <img
            src="/icons/user.svg"
            alt="user-icon"
            className="h-[50px]"
          />
        </div>
      </div>
      {tab && setTab && !manage && (
        <div className="flex justify-center gap-4 mt-2 w-full">
          <button
            className={tab === 'general'
              ? "px-4 py-2 rounded-full font-semibold bg-[#2DA800] text-white"
              : "px-4 py-2 rounded-full font-semibold bg-[#DEE1E6] text-[#171A1F]"}
            onClick={() => setTab('general')}
          >
            General
          </button>
          <button
            className={tab === 'posts'
              ? "px-4 py-2 rounded-full font-semibold bg-[#2DA800] text-white"
              : "px-4 py-2 rounded-full font-semibold bg-[#DEE1E6] text-[#171A1F]"}
            onClick={() => setTab('posts')}
          >
            Posts
          </button>
        </div>
      )}
    </header>
  );
}
const HeaderDesktop = ( { tab, setTab } ) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return <header className="h-20 justify-between top-0 left-0 right-0 p-4 border-gray-300 bg-white items-center hidden md:flex flex-row fixed z-50">
      <div className="w-full flex flex-row justify-between items-center">
        <img src="/icons/logo2.png" alt="RatingEats" className="h-20 cursor-pointer " onClick={() => {navigate('/'); location.reload();}}/>
      </div>
      {tab && setTab && (
        <div className="flex justify-start gap-6 mt-2 w-full">
          <button
            className={tab === 'general'
              ? "px-4 py-2 rounded-full font-semibold bg-[#2DA800] text-white"
              : "px-4 py-2 rounded-full font-semibold bg-[#DEE1E6] text-[#171A1F]"}
            onClick={() => setTab('general')}
          >
            General
          </button>
          <button
            className={tab === 'posts'
              ? "px-4 py-2 rounded-full font-semibold bg-[#2DA800] text-white"
              : "px-4 py-2 rounded-full font-semibold bg-[#DEE1E6] text-[#171A1F]"}
            onClick={() => setTab('posts')}
          >
            Posts
          </button>
        </div>
      )}
        <div className='relative ml-40' ref={menuRef}>
          <img src="/icons/user.svg" alt="user-icon" className="h-20" onClick={() => setShowMenu(!showMenu)}/>
          {showMenu && <UserMenu onClose={() => setShowMenu(false)} />}
        </div>
    </header>
}

const SearchBarMobile = () => {
  const Search = (value) => {

  }
  return (
    <section className='bg-[#ECFFE6] h-20 flex items-center justify-center mt-2 mb-4 md:hidden min-w-[400px] sm:min-w-full'>
      <div className="flex items-center w-[90%] h-full">
        <div className="relative w-full">
          <input
          type="text"
          className='h-12 w-full pl-10 pr-25 bg-white border border-[#DEE1E6]  focus:outline-none focus:ring-2 focus:ring-green-500 rounded-l-4xl rounded-r-4xl text-black'
          placeholder="Search by name, categories..."
        />
        <button className="h-full w-[50px] bg-[#258A00] flex items-center justify-center absolute top-1/2 right-12 transform -translate-y-1/2 ml-2 rounded-l-4xl ">
          <img src="/icons/magnifying-glass-v2.svg" alt="search-icon" className="h-[60%] w-[80%]" />
        </button>
          <button className="h-full w-[50px] bg-[#258A00] border-l-2 border-white flex items-center justify-center ml-2 absolute right-0 top-1/2 transform -translate-y-1/2 rounded-r-4xl">
          <img src="/icons/filter-v2.svg" alt="filter-icon" className="h-[60%] w-[80%]" />
        </button>
        </div>
      </div>
    </section>
  );
}

const SearchBarDesktop = ( {setRestaurants }) => {
  const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = async () => {
      try {
        const response = await api.get('/filter/search', { params: { searchBar: searchTerm } });
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    }
  return (
    <section className=' h-20 items-center justify-center mt-25 mb-4 hidden md:flex md:flex-col mx-auto'>
      <h1 className="text-3xl text-black mt-10">Discover your next culinary adventure</h1>
      <p className="text-[#565D6D] mb-8">Explore local flavors, book tables, and share your dining experiences with DineSpot.</p>
      <div className="flex items-center w-[60%] h-full">
        <div className="relative w-full">
          <input
            type="text"
            className='h-12 w-full pl-5 pr-15 border border-[#DEE1E6] focus:outline-none focus:ring-2 focus:ring-green-500 rounded-l-4xl rounded-r-4xl text-black'
            placeholder="Search by name, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="h-12 w-[50px] bg-[#258A00] rounded-xl flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 rounded-l-4xl rounded-r-4xl" onClick={handleSearch}>
            <img src="/icons/magnifying-glass-v2.svg" alt="search-icon" className="h-[70%] w-[80%]" />
          </button>
        </div>
      </div>
    </section>
  );
};

const UserMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/login');
    onClose();
    };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {navigate('/profile'); onClose();}}>Perfil</button>
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
    </div>
  );
};

const HeaderProfile = ({ title, setTitle, name }) => {
  const navigate = useNavigate();
  return (
    <header className="h-20 justify-between top-0 left-0 right-0 flex p-4 border-gray-300 bg-white items-center md:hidden relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />
      <label htmlFor="menu-toggle" className="cursor-pointer z-50">
        <img src="/icons/hamburger.svg" alt="menu-hamburger" className="w-10" />
      </label>
      <h1 className="absolute text-xl font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{title}</h1>
      <label
        htmlFor="menu-toggle"
        className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 hidden peer-checked:block"
      />
      <div className="fixed top-0 left-0 h-full w-56 bg-white shadow-lg z-50 flex flex-col gap-4 p-6
        -translate-x-full peer-checked:translate-x-0 transition-transform duration-300
        peer-checked:visible invisible">
        <label htmlFor="menu-toggle" className="self-end cursor-pointer">
          <span className="text-2xl"></span>
        </label>
        <p>Hello, {name}</p>
        <button className="transition-transform duration-300 text-left bg-[#2DA800] h-[30px] rounded-md text-white flex items-center justify-center w-full" onClick={() => setTitle('My Profile')}>My Profile</button>
        <button className="transition-transform duration-300 text-left bg-[#2DA800] h-[30px] rounded-md text-white flex items-center justify-center w-full" onClick={() => setTitle('My Reviews')}>My Reviews</button>
        <button className="transition-transform duration-300 text-left bg-[#2DA800] h-[30px] rounded-md text-white flex items-center justify-center w-full" onClick={() => {setTitle('My Restaurants'); navigate(<MyRestaurants />);}}>My restaurants</button>
        <div className='mt-auto flex flex-col gap-2'>
          <button onClick={() => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            navigate('/login');
          }}
          className='text-white bg-red-500 h-[30px] w-full rounded-md flex items-center justify-center'
          >Log out</button>
          <img src="/icons/logo2.png" alt="logo" className="h-20 w-full object-contain" />
        </div>
      </div>
    </header>
  );
}

const AsideManager = ({  setTitle }) => {
  return (
    <aside className="flex p-4 border-gray-300 bg-white items-center md:hidden relative ">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />
      <label htmlFor="menu-toggle" className="cursor-pointer z-50 ">
        <img src="/icons/hamburger.svg" alt="menu-hamburger" className="w-10 ml-0" />
      </label>
      <label
        htmlFor="menu-toggle"
        className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 hidden peer-checked:block"
      />
      <div className="w-[50vw] fixed top-0 left-0 h-full bg-white shadow-lg z-50 flex flex-col gap-4 p-6
        -translate-x-full peer-checked:translate-x-0 transition-transform duration-300
        peer-checked:visible invisible">
        <label htmlFor="menu-toggle" className="self-end cursor-pointer">
          <span className="text-2xl"></span>
        </label>
        <button
            className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center'
            onClick={() => setTitle('details')}
          >
            Restaurant Details
          </button>
          <button
            className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center'
            onClick={() => setTitle('reservations')}
          >
            Reservations history
          </button>
          <button
            className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center'
            onClick={() => setTitle('pending')}
          >
            Pending Reservations
          </button>
          <button
            className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center'
            onClick={() => setTitle('posts')}
          >
            Posts Management
          </button>
          <button
            className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center'
            onClick={() => setTitle('postsHistory')}
          >
            Posts History
          </button>
          <button
            className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center'
            onClick={() => setTitle('menu')}
          >
            Menu Management
          </button>
          <button className='h-auto w-[80%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem] flex items-center justify-center' onClick={() => setTitle('editInfo')}>
            Edit information
          </button>
      </div>
    </aside>
  );
}

const HeaderProfileDesktop = ({ title, setTitle }) => {
  const navigate = useNavigate();
  return (
    <header className="h-20 max-h-screen top-0 left-0 p-4 border-gray-300  items-center justify-start md:flex hidden">
      <div className='grid grid-cols-[300px_1fr] '>
        <img src="/icons/logo2.png" alt="logo" className="w-70 object-contain mt-8 cursor-pointer" onClick={() => navigate('/')}/>
        <div className='flex justify-end gap-6 items-center w-full'>
          <button className={title === 'My Profile' ? 'text-[#2DA800] h-[30px] text-[2rem] font-semibold cursor-pointer' : 'text-[#171A1F] h-[30px] rounded-md text-[2rem] font-semibold cursor-pointer'} onClick={() => setTitle('My Profile')}>My Profile</button>
          <button className={title === 'My Reviews' ? 'text-[#2DA800] h-[30px] text-[2rem] font-semibold cursor-pointer' : 'text-[#171A1F] h-[30px] rounded-md text-[2rem] font-semibold cursor-pointer'} onClick={() => setTitle('My Reviews')}>My Reviews</button>
          <button className={title === 'My Restaurants' ? 'text-[#2DA800] h-[30px] text-[2rem] font-semibold cursor-pointer' : 'text-[#171A1F] h-[30px] rounded-md text-[2rem] font-semibold cursor-pointer'} onClick={() => setTitle('My Restaurants')}>My Restaurants</button>
          
        </div>
      </div>
    </header>
  );
}

export { HeaderMobile, HeaderDesktop, SearchBarMobile, SearchBarDesktop, HeaderProfile, HeaderProfileDesktop, AsideManager };
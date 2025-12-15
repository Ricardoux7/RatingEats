/**
 * Components Module
 *
 * Contiene componentes reutilizables para la navegación, búsqueda y menús de usuario en la aplicación.
 * Incluye versiones móviles y de escritorio de headers, menús y barras de búsqueda.
 *
 * Componentes exportados:
 * - HeaderMobile
 * - HeaderDesktop
 * - SearchBarMobile
 * - SearchBarDesktop
 * - UserMenu
 * - NotificationMenu
 * - HeaderProfile
 * - HeaderProfileDesktop
 * - AsideManager
 *
 * Cada componente tiene props y lógica específica para su función en la UI.
 *
 * @module Components
 */
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
//import MyRestaurant from '../pages/ManageRestaurant';
import MyRestaurants from './Profile/MyRestaurants';
import { useAuth } from '../context/AuthContext.jsx';
//import Results from './Search.jsx';
import api from '../api/api.js';
import Notifications from './Notifications.jsx';

const HeaderMobile = ({ tab, setTab, manage }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const menuRef = useRef();
  const notiRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    };
    if (showMenu || showNoti) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showNoti]);
  return (
    <header className={`${tab ? 'h-40' : 'h-20'} top-0 left-0 right-0 flex flex-col p-4 border-gray-300 bg-white items-center md:hidden`}>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex items-center min-w-[50px]">
          {manage && <AsideManager setTitle={setTab} />}
        </div>
        <div className={`flex-1 flex justify-center`}>
          <img
            src="/icons/logo2.png"
            alt="RatingEats"
            className="h-18 max-w-[220px] object-contain" 
            onClick={() => {navigate('/'); location.reload();}}
          />
        </div>
        <div className="flex items-center min-w-auto mr-2" ref={notiRef}>
          {showNoti && <NotificationMenu onClose={() => setShowNoti(false)} />}
          <div>
            <img
              src="/icons/bell.svg"
              alt=""
              className='h-[50px]'
              onClick={() => {
                setShowNoti((prev) => {
                  if (!prev) setShowMenu(false);
                  return !prev;
                });
              }}
            />
          </div>
        </div>
        <div className="flex items-center min-w-auto" ref={menuRef}>
          {showMenu && <UserMenu onClose={() => setShowMenu(false)} />}
          <img
            src="/icons/user.svg"
            alt="user-icon"
            className="h-[50px]"
            onClick={() => {
              setShowMenu((prev) => {
                if (!prev) setShowNoti(false);
                return !prev;
              });
            }}
          />
        </div>
      </div>
      {tab && setTab && !manage && (
        <div className="w-full flex flex-col items-center mt-2">
          <div className="flex flex-wrap justify-center gap-4 w-full">
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
        </div>
      )}
    </header>
  );
}
const HeaderDesktop = ( { tab, setTab } ) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const menuRef = useRef();
  const notiRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    };
    if (showMenu || showNoti) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showNoti]);

  return <header className="h-20 justify-between top-0 left-0 right-0 p-4 border-gray-300 bg-white items-center hidden md:flex flex-row sticky z-5000 ">
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
        <div className='flex gap-6 items-center'>
          <div className='relative' ref={notiRef}>
            {showNoti && <NotificationMenu onClose={() => setShowNoti(false)} />}
            <img
              src="/icons/bell.svg"
              alt="noti-icon"
              className={tab && setTab ? 'w-[115px]' : 'w-[50px]'}
              onClick={() => {
                setShowNoti((prev) => {
                  if (!prev) setShowMenu(false);
                  return !prev;
                });
              }}
            />
          </div>
          <div className='relative' ref={menuRef}>
            <img
              src="/icons/user.svg"
              alt="user-icon"
              className={tab && setTab ? 'w-[115px]' : 'w-[50px]'}
              onClick={() => {
                setShowMenu((prev) => {
                  if (!prev) setShowNoti(false);
                  return !prev;
                });
              }}
            />
            {showMenu && <UserMenu onClose={() => setShowMenu(false)} />}
          </div>
        </div>
    </header>
}


const SearchBarMobile = ({ setRestaurants, searchError, setSearchError, onFilterClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    if (searchError) setSearchError('');
  }, [searchTerm]);
  const handleSearch = async () => {
    try {
      let response;
      if (!searchTerm.trim()) {
        response = await api.get('/filter');
      } else {
        response = await api.get('/filter/search', { params: { searchBar: searchTerm } });
      }
      setRestaurants(response.data);
    } catch (err) {
      console.error('No matching restaurants found:');
      if (err.response && err.response.data && err.response.data.message) {
        setSearchError(err.response.data.message);
        setRestaurants([]);
      } else {
        setSearchError("An error occurred.");
        setRestaurants([]);
      }
    }
  };
  return (
    <section className='bg-[#ECFFE6] h-20 flex items-center justify-center mt-2 mb-4 md:hidden min-w-[400px] sm:min-w-full'>
      <div className="flex items-center w-[90%] h-full">
        <div className="relative w-full">
          <input
            type="text"
            className='h-12 w-full pl-10 pr-25 bg-white border border-[#DEE1E6]  focus:outline-none focus:ring-2 focus:ring-green-500 rounded-l-4xl rounded-r-4xl text-black'
            placeholder="Search by name, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button className="h-full w-[50px] bg-[#258A00] flex items-center justify-center absolute top-1/2 right-12 transform -translate-y-1/2 ml-2 rounded-l-4xl " onClick={handleSearch}>
            <img src="/icons/magnifying-glass-v2.svg" alt="search-icon" className="h-[60%] w-[70%]" />
          </button>
          <button className="h-full w-[50px] bg-[#258A00] border-l-2 border-white flex items-center justify-center ml-2 absolute right-0 top-1/2 transform -translate-y-1/2 rounded-r-4xl" type="button" onClick={() => onFilterClick()}>
            <img src="/icons/filter-v2.svg" alt="filter-icon" className="h-[60%] w-[70%]" />
          </button>
        </div>
      </div>
    </section>
  );
}

const SearchBarDesktop = ( {setRestaurants, searchError, setSearchError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (searchError) setSearchError('');
  }, [searchTerm]);
    const handleSearch = async () => {
      try {
        let response;
        if (!searchTerm.trim()) {
          response = await api.get('/filter');
        } else {
          response = await api.get('/filter/search', { params: { searchBar: searchTerm } });
        }
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:');
        if (err.response && err.response.data && err.response.data.message) {
          setSearchError(err.response.data.message);
          setRestaurants([]);
        } else {
          setSearchError("An error occurred.");
          setRestaurants([]);
        }
      }
    };
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
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
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
  const [buttonName, setButtonName] = useState('Login');
    const { user, logOut } = useAuth();
  useEffect(() => {
    if (user) {
      setButtonName('Profile');
    }
  }, [user]);

  const handleLogout = () => {
      logOut();
      onClose && onClose();
      navigate('/login', { replace: true });
  };

  const handleLogIn = () =>{
    if (!user) {
      navigate('/login');
    }
  }

  return (
    <div
      className="absolute right-0 mt-50 md:mt-0 w-56 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 p-2 flex flex-col gap-2 animate-fade-in"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="w-full text-left px-5 py-3 rounded-lg font-semibold text-[#1D2025] transition-all duration-150 bg-linear-to-r from-[#f8fff8] to-[#e6fbe6] hover:from-[#e6fbe6] hover:to-[#c6f7c6] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2DA800]/40"
        onClick={() => {buttonName === 'Login' ? handleLogIn() : navigate('/profile'); onClose();}}
      >
        {buttonName}
      </button>
      {buttonName === 'Login' && (
        <button
          className="w-full text-left px-5 py-3 rounded-lg font-semibold text-[#2DA800] border border-[#2DA800] bg-linear-to-r from-[#e6fbe6] to-[#f8fff8] hover:from-[#c6f7c6] hover:to-[#e6fbe6] shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2DA800]/40"
          onClick={() => { navigate('/register'); onClose(); }}
        >
          Register
        </button>
      )}
      {buttonName === 'Profile' && (
        <button
          className="w-full text-left px-5 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-[#ff5f5f] to-[#ff2d2d] hover:from-[#ff2d2d] hover:to-[#b80000] shadow-sm hover:shadow-md transition-all duration-150 mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

const NotificationMenu = ({ onClose }) => {
  const [buttonName, setButtonName] = useState('Notifications');
    const { user, notifications } = useAuth();
  useEffect(() => {
    if (user) {
      setButtonName('Notifications');
    }
  }, [user]);

  return (
    <div onClick={e => e.stopPropagation()}>
      <Notifications onClose={onClose} />
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
          <img src="/icons/logo2.png" alt="logo" className="h-20 w-full object-contain" onClick={() => {navigate('/')}} />
        </div>
      </div>
    </header>
  );
}

const AsideManager = ({ setTitle }) => {
  const buttons = [
    { label: 'Restaurant Details', onClick: () => setTitle('details') },
    { label: 'Reservations history', onClick: () => setTitle('reservations') },
    { label: 'Pending Reservations', onClick: () => setTitle('pending') },
    { label: 'Posts Management', onClick: () => setTitle('posts') },
    { label: 'Posts History', onClick: () => setTitle('postsHistory') },
    { label: 'Menu Management', onClick: () => setTitle('menu') },
    { label: 'Edit information', onClick: () => setTitle('editInfo') },
    { label: 'Upload Post', onClick: () => setTitle('uploadPost') },
    { label: 'Add Operator', onClick: () => setTitle('addOperator') },
    { label: 'Delete Operator', onClick: () => setTitle('deleteOperator') },
    { label: 'Delete Restaurant', onClick: () => setTitle('deleteRestaurant'), danger: true },
  ];
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
      <div className="w-[70vw] max-w-xs fixed top-0 left-0 h-full bg-white shadow-lg z-50 flex flex-col gap-3 p-4 -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 peer-checked:visible invisible overflow-y-auto">
        <label htmlFor="menu-toggle" className="self-end cursor-pointer">
          <span className="text-2xl"></span>
        </label>
        {buttons.map((btn, idx) => (
          <button
            key={btn.label}
            className={`w-full px-4 py-3 rounded-lg font-semibold text-[1.1rem] flex items-center justify-center transition-all duration-150 shadow-sm border focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-linear-to-r from-[#f8fff8] to-[#e6fbe6] hover:from-[#e6fbe6] hover:to-[#c6f7c6] border-[#DEE1E6] text-[#1D2025] whitespace-nowrap overflow-hidden text-ellipsis ${btn.danger ? 'bg-linear-to-r from-[#ff5f5f] to-[#ff2d2d] text-white border-none hover:from-[#ff2d2d] hover:to-[#b80000] focus:ring-red-400' : ''} max-w-full min-h-12`}
            onClick={btn.onClick}
            title={btn.label}
          >
            <span className="block w-full truncate">{btn.label}</span>
          </button>
        ))}
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
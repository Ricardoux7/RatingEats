import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const HeaderMobile = () => {
  const navigate = useNavigate();
  return <header className="h-20 justify-between top-0 left-0 right-0 flex  p-4 border-gray-300 bg-white items-center display md:hidden">
    <div>
      <img src="../icons/hamburger.svg" alt="menu-hamburger" className="h-[50px]" />
    </div>
    <div>
      <img src="../icons/logo2.png" alt="RatingEats" className="h-20" onClick={() => navigate('/')} />
    </div>
    <div>
      <img src="../icons/user.svg" alt="user-icon" className="h-[50px]" />
    </div>
  </header>
}

const HeaderDesktop = () => {
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

  return <header className="h-20 justify-between top-0 left-0 right-0 p-4 border-gray-300 bg-white items-center hidden md:flex">
    <div>
      <img src="../icons/logo2.png" alt="RatingEats" className="h-20 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
    </div>
    <div className='relative' ref={menuRef}>
      <img src="../icons/user.svg" alt="user-icon" className="h-10" onClick={() => setShowMenu(!showMenu)}/>
      {showMenu && <UserMenu onClose={() => setShowMenu(false)} />}
    </div>
  </header>
}

const SearchBarMobile = () => {
  return (
    <section className='bg-[#ECFFE6] h-20 flex items-center justify-center mt-2 mb-4 md:hidden'>
      <div className="flex items-center w-[90%] h-full">
        <div className="relative w-full">
          <input
          type="text"
          className='h-12 w-full pl-10 pr-25 bg-white border border-[#DEE1E6]  focus:outline-none focus:ring-2 focus:ring-green-500 rounded-l-4xl rounded-r-4xl text-black'
          placeholder="Search by name, categories..."
        />
        <img src="../icons/magnifying-glass-bar.svg" alt="" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6"/>
        <button className="h-full w-[50px] bg-[#258A00] flex items-center justify-center absolute top-1/2 right-12 transform -translate-y-1/2 ml-2 rounded-l-4xl ">
          <img src="../icons/magnifying-glass-v2.svg" alt="search-icon" className="h-[60%] w-[80%]" />
        </button>
          <button className="h-full w-[50px] bg-[#258A00] border-l-2 border-white flex items-center justify-center ml-2 absolute right-0 top-1/2 transform -translate-y-1/2 rounded-r-4xl">
          <img src="../icons/filter-v2.svg" alt="filter-icon" className="h-[60%] w-[80%]" />
        </button>
        </div>
      </div>
    </section>
  );
}

const SearchBarDesktop = () => {
  return (
    <section className=' h-20 items-center justify-center mt-2 mb-4 hidden md:flex md:flex-col'>
      <h1 className="text-3xl text-black mt-10">Discover your next culinary adventure</h1>
      <p className="text-[#565D6D] mb-8">Explore local flavors, book tables, and share your dining experiences with DineSpot.</p>
      <div className="flex items-center w-[60%] h-full">
        <div className="relative w-full">
          <input
            type="text"
            className='h-12 w-full pl-10 pr-15 border border-[#DEE1E6]  focus:outline-none focus:ring-2 focus:ring-green-500 rounded-l-4xl rounded-r-4xl text-black'
            placeholder="Search by name, categories..."
          />
          <img src="../icons/magnifying-glass-bar.svg" alt="search-icon" className="absolute h-6 w-6" />
          <button className="h-12 w-[50px] bg-[#258A00] rounded-xl flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 rounded-l-4xl rounded-r-4xl">
            <img src="../icons/magnifying-glass-v2.svg" alt="search-icon" className="h-[70%] w-[80%]" />
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
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {navigate('/profile'); onClose();}}>Perfil</button>
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {navigate('/my-restaurants'); onClose();}}>Mis restaurantes</button>
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
        <img src="../icons/hamburger.svg" alt="menu-hamburger" className="w-10" />
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
        <button className="transition-transform duration-300 text-left bg-[#2DA800] h-[30px] rounded-md text-white flex items-center justify-center w-full" onClick={() => setTitle('My Restaurants')}>My restaurants</button>
        <div className='mt-auto flex flex-col gap-2'>
          <button onClick={() => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            navigate('/login');
          }}
          className='text-white bg-red-500 h-[30px] w-full rounded-md flex items-center justify-center'
          >Log out</button>
          <img src="../icons/logo2.png" alt="logo" className="h-20 w-full object-contain" />
        </div>
      </div>
    </header>
  );
}

const HeaderProfileDesktop = ({ name }) => {
  const navigate = useNavigate();
  return (
    <header className="h-20 top-0 left-0 p-4 border-gray-300  items-center justify-start md:flex hidden">
      <div className='flex flex-row gap-25 items-center ml-[7%]'>
        <button className='transition-transform duration-300 text-left h-[30px] rounded-md text-[#2DA800] flex items-center justify-center w-full text-[2rem] font-bold'>Profile</button>
        <button className='transition-transform duration-300 text-left h-[30px] rounded-md text-[#2DA800] flex items-center justify-center w-full text-[2rem] font-bold'>Reviews</button>
        <button className='transition-transform duration-300 text-left h-[30px] rounded-md text-[#2DA800] flex items-center justify-center w-full text-[2rem] font-bold'>Restaurants</button>
      </div>
    </header>
  );
}

export { HeaderMobile, HeaderDesktop, SearchBarMobile, SearchBarDesktop, HeaderProfile, HeaderProfileDesktop };
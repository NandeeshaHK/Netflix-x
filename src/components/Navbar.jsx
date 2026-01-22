import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import './Navbar.css';

import logo from '../assets/logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { currentProfile, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!currentProfile) return null;

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="left">
                    <Link to="/" className="brand-logo">
                        <img src={logo} alt="StreamFlix" />
                        <span className="brand-text">
                            <span className="text-white">STREAM</span>
                            <span className="text-red">FLIX</span>
                        </span>
                    </Link>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/tv">TV Shows</Link></li>
                        <li><Link to="/movies">Movies</Link></li>
                        <li><Link to="/latest">New & Popular</Link></li>
                        <li><Link to="/list">My List</Link></li>
                    </ul>
                </div>

                <div className="right">
                    <div className="icon-wrapper">
                        <Search className="icon" onClick={() => navigate('/search')} />
                    </div>
                    <div className="icon-wrapper">
                        <Bell className="icon" />
                    </div>

                    <div className="profile-menu">
                        <div className="profile-trigger">
                            <img src={`/assets/${currentProfile.avatar}`} alt="Avatar" className="avatar-sm"
                                onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'} />
                        </div>
                        <div className="dropdown">
                            <span>{currentProfile.name}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={14} /> Sign out of StreamFlix
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

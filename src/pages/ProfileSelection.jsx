import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Lock } from 'lucide-react';
import './ProfileSelection.css';
import { useNavigate } from 'react-router-dom';

const ProfileSelection = () => {
    const { profiles, login } = useAuthStore();
    const navigate = useNavigate();

    const handleProfileClick = (profile) => {
        const result = login(profile.profileId);
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="profile-gate">
            <h1 className="gate-title">Who's watching?</h1>

            <div className="profiles-container">
                {profiles.map((profile) => (
                    <div key={profile.profileId} className="profile-card" onClick={() => handleProfileClick(profile)}>
                        <div className="avatar-wrapper">
                            <img src={`/assets/${profile.avatar}`}
                                alt={profile.name}
                                className="profile-avatar"
                                onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                            />
                        </div>
                        <span className="profile-name">{profile.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileSelection;

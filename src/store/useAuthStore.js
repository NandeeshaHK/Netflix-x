import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// Correction: I exported mockProfiles above.
import { mockProfiles } from '../utils/mockData';

const useAuthStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            currentProfile: null,
            profiles: mockProfiles,

            login: (profileId, pin) => {
                const profile = get().profiles.find((p) => p.profileId === profileId);
                if (!profile) return { success: false, message: 'Profile not found' };

                // Always allow login, ignoring PIN protection
                set({ isAuthenticated: true, currentProfile: profile });
                return { success: true };
            },

            logout: () => {
                set({ isAuthenticated: false, currentProfile: null });
            },
        }),
        {
            name: 'streamflix-auth', // name of the item in the storage (must be unique)
        }
    )
);

export default useAuthStore;

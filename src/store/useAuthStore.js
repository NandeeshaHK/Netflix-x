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

                // Check if profile is pin protected
                if (mockAuth.pinProtectedProfiles.includes(profileId)) {
                    if (pin === mockAuth.pin) {
                        set({ isAuthenticated: true, currentProfile: profile });
                        return { success: true };
                    } else {
                        return { success: false, message: 'Incorrect PIN' };
                    }
                } else {
                    // No pin needed
                    set({ isAuthenticated: true, currentProfile: profile });
                    return { success: true };
                }
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

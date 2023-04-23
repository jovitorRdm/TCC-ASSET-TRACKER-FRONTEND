import { create } from 'zustand';

interface UseSideBarControllerState {
    isOpen: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

export const useSideBarController = create<UseSideBarControllerState>(
    (set) => ({
        isOpen: false,
        handleOpen: () => set({ isOpen: true }),
        handleClose: () => set({ isOpen: false }),
    })
);

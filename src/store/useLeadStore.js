import { create } from "zustand";

const useLeadStore = create((set) => ({
    storeFirstName: "",
    storeLastName: "",
    storeCompanyName: "",
    storeDealerGroup: "",
    storeWorkEmail: "",
    storeSoasPerMonth: "",
    formType: "",

    setFirstName: (storeFirstName) => set({ storeFirstName }),
    setLastName: (storeLastName) => set({ storeLastName }),
    setCompanyName: (storeCompanyName) => set({ storeCompanyName }),
    setDealerGroup: (storeDealerGroup) => set({ storeDealerGroup }),
    setWorkEmail: (storeWorkEmail) => set({ storeWorkEmail }),
    setSoasPerMonth: (storeSoasPerMonth) => set({ storeSoasPerMonth }),
    setFormType: (formType) => set({ formType }),

    updateForm: (data) =>
        set((state) => ({
            ...state,
            ...data,
        })),

    resetForm: () =>
        set({
            storeFirstName: "",
            storeLastName: "",
            storeCompanyName: "",
            storeDealerGroup: "",
            storeWorkEmail: "",
            storeSoasPerMonth: "",
            formType: "",
        }),
}));

export default useLeadStore;
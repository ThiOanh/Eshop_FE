import { create } from "zustand";

import { axiosClient } from "@/helper/axios/axiosClient";

const initialState = {
  isLoading: false,
  payload: {},
};

const useFetchCheckout = create((set) => ({
  ...initialState,

  fetch: async (data) => {
    try {
      const url = "/vnPay/create_payment_url";

      const response = await axiosClient.post(url, data);

      set({ payload: response.data });
    } catch (error) {
      set({ payload: error.response.data });
    }
  },

  reset: async () => {
    set({ payload: initialState.payload });
  },
}));

export default useFetchCheckout;

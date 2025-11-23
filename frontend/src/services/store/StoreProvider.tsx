"use client"

import React, { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { setupAxiosInterceptors } from "../axiosInterceptor";

function StoreProvider({children}: {children: React.ReactNode}) {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <Provider store={store}>{children}</Provider>
  )
}

export default StoreProvider;
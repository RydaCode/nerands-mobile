import { createContext, useContext } from "react";

export const NotificationContext = createContext();

export const useNotificationModal = () => useContext(NotificationContext);
// ToastContext.js
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import "../styles/toast.css";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, visible: false },
    ]);

    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === id ? { ...toast, visible: true } : toast
        )
      );
    }, 10); // Dodaj krótki czas na renderowanie przed rozpoczęciem animacji

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, visible: false } : toast
      )
    );

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 500); // Dopasuj do czasu trwania animacji CSS
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {" "}
      {children}{" "}
      <div className="toast-container">
        {" "}
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${
              toast.visible ? "toast-show" : ""
            }`}
          >
            {toast.message}{" "}
            <button onClick={() => removeToast(toast.id)}> x </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </ToastContext.Provider>
  );
};

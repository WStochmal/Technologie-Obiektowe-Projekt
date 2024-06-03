// libraries
import { createContext, useReducer, useEffect } from "react";
import io from "socket.io-client";

// create context
export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload, socket: action.socket };
        case "LOGOUT":
            if (state.socket) {
                state.socket.disconnect();
            }
            return { user: null, socket: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        socket: null,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        const initializeSocket = () => {
            return new Promise((resolve, reject) => {
                const socket = io.connect("http://127.0.0.1:5000");

                socket.on("connect", () => {
                    console.log("Socket connected:", socket.id);
                    resolve(socket);
                });

                socket.on("error", (error) => {
                    console.error("Socket initialization error:", error);
                    reject(error);
                });
            });
        };

        if (user && !state.socket) {
            initializeSocket()
                .then((socket) => {
                    dispatch({ type: "LOGIN", payload: user, socket: socket });
                })
                .catch((error) => {
                    console.error("Socket initialization error:", error);
                });
        }

        return () => {
            if (state.socket) {
                state.socket.disconnect();
            }
        };
    }, [state]);

    console.log("AuthContext State: ", state);

    return ( <
        AuthContext.Provider value = {
            {...state, dispatch } } > { children } <
        /AuthContext.Provider>
    );
};
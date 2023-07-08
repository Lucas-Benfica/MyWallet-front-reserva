import { createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({children}){
    const persistedAuth = JSON.parce(localStorage.getItem("auth"));
    const [auth, setAuth] = useState(persistedAuth);

    function login(authData){
        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
    }

    return (
        <AuthContext.Provider value={{auth, login}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
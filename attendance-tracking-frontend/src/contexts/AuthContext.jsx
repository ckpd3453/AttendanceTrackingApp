import React, {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const[token, setToken] = useState(null);
    const[userData, setUserData] = useState(null);
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const storedData = JSON.parse(localStorage.getItem('user_data'));

    useEffect(() => {
        if(storedData){
            const {useToken, user} = storedData;
            setToken(useToken);
            setUserData(user);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (newToken, newData) => {
        localStorage.setItem('user_data',
        JSON.stringify({ useToken: newToken, user: newData})
        )
        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={(token, isAuthenticated, login, logout, userData)}
        >{children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

import axios from "axios";
import useAuth from "../hooks/useAuth";

const URL = import.meta.env.VITE_API_URL;

function createConfig(token){
    return {headers: { Authorization: `Bearer ${token}` }};
}

function login(body){
    const promise = axios.post(`${URL}/`, body);
    return promise;
}

function singUp(body){
    const promise = axios.post(`${URL}/cadastro`, body);
    return promise;
}

function getHistory(token){
    const config = createConfig(token);
    const promise = axios.get(`${URL}/home`, config)
    return promise;
}

function createTransaction(type, body, token){
    const config = createConfig(token);
    const promise = axios.post(`${URL}/nova-transacao/${type}`, body, config);
    return promise;
}

function logout(token){
    localStorage.removeItem("auth");

    const config = createConfig(token);
    const promise = axios.get(`${URL}/logout`, config);
    return promise;
}

const api = {
    login,
    singUp,
    getHistory,
    createTransaction,
    logout
};

export default api;
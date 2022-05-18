import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; //dependencia para guardar en el storage
import cafeApi from "../api/cafeApi";
import { LoginData, LoginResponse, Usuario, RegisterData } from '../interface/appInterfaces';
import { authReducer, AuthState } from './authReducer';

//1 - como quiero que se vea la info que va a manejar en context
type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: LoginData) => void; //tiene que recibir el tipo LoginData ({correo, password})
    logOut: () => void;
    removeError: () => void;
}

//2- crear el estado inicial
const authInicialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

//3 - creamos context
export const AuthContext = createContext({} as AuthContextProps);

//4 - creamos el proveedor
export const AuthProvider = ({ children }: any) => {


    const [state, dispatch] = useReducer(authReducer, authInicialState)

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        //leer el token cuando se recarga la pantalla
        const token = await AsyncStorage.getItem('token');

        //No token, no autenticado entonces
        if (!token) return dispatch({ type: 'notAuthenticated' })

        //Hay token
        const resp = await cafeApi.get('/auth');

        if (resp.status !== 200) {
            return dispatch({ type: 'notAuthenticated' })
        }

        await AsyncStorage.setItem('token', resp.data.token); //obtenemos el token para la cache

        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario

            }
        })

    }

    const signIn = async ({ correo, password }: LoginData) => {

        try {

            //post<Interface:LoginResponse preconfigurada de los resultados>
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password }); //NOTA: ya tiene pre-establecido la ruta ip:8080/api solo se le pone la ruta del endpoint

            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            })

        } catch (error: any) {
            console.log(error.response.data.msg);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Informacion incorrecta'
            })
        }
    };

    const signUp = async({ nombre, correo, password }: RegisterData) => {
        try {

            //post<Interface:LoginResponse preconfigurada de los resultados>
            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { correo, password }); //NOTA: ya tiene pre-establecido la ruta ip:8080/api solo se le pone la ruta del endpoint
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            console.log(error.response.data.msg);
            dispatch({
                type: 'addError',
                payload: error.response.data[0].msg || 'Revise la informacion'
            })
        }
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });

    };

    const removeError = () => {
        dispatch({ type: 'removeError' })
    };

    return (
        <AuthContext.Provider value={{
            ...state, //sabe que estan las propiedades inicializadas debido al authInicialState
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )

}


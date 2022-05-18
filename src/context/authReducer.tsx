import { Usuario } from "../interface/appInterfaces";

//1 - Definimos States
export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    errorMessage: string;
    user: Usuario | null;

}

//2 - Definimos Actions
type AuthAction = 
    | {type: 'signUp', payload: {token: string, user: Usuario}}
    | {type: 'addError', payload: string}
    | {type: 'removeError'}
    | {type: 'notAuthenticated'}
    | {type: 'logout'}

//Definimos Reducer y su estructura con Switch
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {

    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorMessage: action.payload
            }
        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            }
        case 'signUp': 
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user,
            }
        
        //estos dos casos hacen lo mismo, por eso se pone asi
        case 'logout':
        case 'notAuthenticated': 
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null
            }
            
        default:
            return state;
    }
}
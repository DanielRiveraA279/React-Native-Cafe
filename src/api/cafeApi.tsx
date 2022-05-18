
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; //dependencia para guardar en el storage

const baseURL = 'http://192.168.244.65:8080/api'; //conexion local mediante ip

const cafeApi = axios.create({ baseURL });
cafeApi.interceptors.request.use(

    //Middleware para tener el token en la cache para que cuando salga de la app o recargue sea válido
    async (config: any) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['x-token'] = token
        }
        return config;
    }
)

export default cafeApi;


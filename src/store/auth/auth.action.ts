import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {createUser, login, searchAdmin, searchHotelByCodiceHotel, searchUser} from '../../api/auth.service';
import {AmministratoreDTO, CardDataDTO, ClienteDTO, HotelDTO} from '../../models/models';
import {createAdmin, createHotel} from '../../api/auth.service';
import {LoginBean} from '../../models/login';
import axios from 'axios';
import {createCard} from '../../api/stripe.service';
import {searchHotel, searchHotels} from '../../api/hotels.service';
import hotelActions from '../hotel/hotel.action';

const enum LOGIN_ACTIONS {
    adminLogin = 'adminLogin/',
    adminLogout = 'adminLogout/',
    userLogin = 'userLogin/',
    userLogout = 'userLogout/',
    adminRegister = 'adminRegister/',
    userRegister = 'userRegister/'
}

interface AdminRegisterActionBean {
    admin: Partial<AmministratoreDTO>,
    hotel?: Partial<HotelDTO>,
    codiceHotel?: string
}

interface UserRegisterActionBean {
    user: Partial<ClienteDTO>,
    card: Partial<CardDataDTO>
}

const adminLoginRequest = createAsyncThunk(LOGIN_ACTIONS.adminLogin, async (bean:LoginBean, thunkAPI) => {
    try {
        const tokenInfo = (await login(bean)).data;
        if(tokenInfo) {
            axios.defaults.headers['Authorization'] = 'Bearer ' + tokenInfo.access_token;
        }
        const amministratore = (await searchAdmin(bean.username)).data;
        const hotel = (await searchHotel(amministratore.idHotel)).data
        thunkAPI.dispatch(hotelActions.storeHotel(hotel)) //todo store hotel in localstorage
        tokenInfo.token_expiration = tokenInfo.token_expiration.substring(0,19)
        return {
            tokenInfo,
            amministratore
        }
    } catch(e) {
        console.log('Login request failed')
        throw e;
    }
});

const userLoginRequest = createAsyncThunk(LOGIN_ACTIONS.userLogin, async (bean:LoginBean) => {
    try {
        const tokenInfo = (await login(bean)).data;
        if(tokenInfo) {
            axios.defaults.headers['Authorization'] = 'Bearer ' + tokenInfo.access_token;
        }
        const user = (await searchUser(bean.username)).data;
        tokenInfo.token_expiration = tokenInfo.token_expiration.substring(0,19)
        return {
            tokenInfo,
            user
        }
    } catch(e) {
        console.log('Login request failed')
        throw e;
    }
});

const adminRegister = createAsyncThunk(LOGIN_ACTIONS.adminRegister, async (bean:AdminRegisterActionBean) => {
    try {
        const {admin,hotel,codiceHotel} = bean;
        if(hotel) {
            const resp = await createHotel(hotel);
            const newHotel = resp.data;
            await createAdmin({
                admin,
                idHotel: newHotel.id
            })
        }

        if(codiceHotel) {
            const resp = (await searchHotelByCodiceHotel(codiceHotel)).data;
            await createAdmin({
                admin,
                idHotel: resp.id
            })
        }
    } catch(e) {
        console.log('Admin register request failed')
        throw e;
    }
});

const userRegister = createAsyncThunk(LOGIN_ACTIONS.userRegister, async (bean:UserRegisterActionBean) => {
    try {
        const {user, card} = bean;
        const idCliente = (await createUser(user)).data;
        await createCard({
            ...card,
            idCliente
        });

    } catch(e) {
        console.log('User register request failed')
        throw e;
    }
});

const adminLogoutAction = createAction(LOGIN_ACTIONS.adminLogout, () => {
    localStorage.removeItem('AlberGOAdmin');
    axios.defaults.headers['Authorization'] = undefined;
    return {
        payload: null
    }
});

const userLogoutAction = createAction(LOGIN_ACTIONS.userLogout, () => {
    localStorage.removeItem('AlberGOUser');
    axios.defaults.headers['Authorization'] = undefined;
    return {
        payload: null
    }
});

export const loginActions = {
    adminLoginRequest,
    userLoginRequest,
    adminLogoutAction,
    userLogoutAction,
    adminRegister,
    userRegister
};

export default loginActions;

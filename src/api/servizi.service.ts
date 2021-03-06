import {localhostURL} from './axiosConfig';
import {ServizioDTO, StanzaDTO} from '../models/models';
import axios, {AxiosResponse} from 'axios';


const postfix = 'servizio/';

const servizioEndpoints = {
    lista: 'lista',
    create: 'create',
    delete: 'delete',
    update: 'update',
    listaNotInPrenotazione: 'listaNotInPrenotazione',
    insertServizioPrenotazione: 'insertServizioPrenotazione',
    removeServizioPrenotazione: 'removeServizioPrenotazione',
    listaServiziPrenotazione: 'listaServiziPrenotazione'
}

const apiURL = localhostURL + postfix;

export const searchServizi = async (idHotel: number): Promise<AxiosResponse<ServizioDTO[]>> => {
    return axios.get(apiURL+servizioEndpoints.lista,{
        params: {
            idHotel
        }
    });
}

export const searchServiziDisponibiliByPrenotazione = async (idPrenotazione: number): Promise<AxiosResponse<ServizioDTO[]>> => {
    return axios.get(apiURL+servizioEndpoints.listaNotInPrenotazione,{
        params: {
            idPrenotazione
        }
    });
}

export const searchServiziByPrenotazione = async (idPrenotazione: number): Promise<AxiosResponse<ServizioDTO[]>> => {
    return axios.get(apiURL+servizioEndpoints.listaServiziPrenotazione,{
        params: {
            idPrenotazione
        }
    });
}

export const insertServizioIntoPrenotazione = async (idServizio: number, idPrenotazione: number, idHotel:number): Promise<AxiosResponse<number>> => {
    return axios.post(apiURL+servizioEndpoints.insertServizioPrenotazione+'?idServizio=' + idServizio + '&idPrenotazione=' + idPrenotazione +
    '&idHotel='+idHotel);
}

export const deleteServizioInPrenotazione = async (idServizio: number, idPrenotazione: number): Promise<AxiosResponse<Boolean>> => {
    return axios.delete(apiURL+servizioEndpoints.removeServizioPrenotazione,{
        params: {
            idPrenotazione,
            idServizio,
        }
    });
}

export const createServizio = async (servizio: Partial<ServizioDTO>): Promise<AxiosResponse<ServizioDTO>> => {
    return axios.post(apiURL+servizioEndpoints.create,{
        ...servizio
    });
}

export const deleteServizio = async (idServizio: number): Promise<AxiosResponse<ServizioDTO>> => {
    return axios.delete(apiURL+servizioEndpoints.delete,{
        params: {
            idServizio
        }
    });
}


export const updateServizio = async (servizio: ServizioDTO): Promise<AxiosResponse<ServizioDTO>> => {
    return axios.put(apiURL+servizioEndpoints.update,{
        ...servizio
    });
}
import React, {useEffect, useState} from 'react';
import {DatePicker, Input, Typography, Select, Spin, Button} from 'antd';
import 'src/screens/hotel/newServizio/newServizio.scss';
import { UserOutlined } from '@ant-design/icons';
import stanzeSelector from '../../../store/stanze/stanze.selector';
import clientiSelector from '../../../store/clienti/clienti.selector';
import {PrenotazioneDTO} from '../../../models/models';
import {useDispatch, useSelector} from 'react-redux';
import clientiActions from '../../../store/clienti/clienti.action';
import stanzeActions from '../../../store/stanze/stanze.action';
import prenotazioniActions from '../../../store/prenotazioni/prenotazioni.action';

const componentClassName = 'NewServizio';
const NewServizio = () => {

    const {Title} = Typography;
    const {Option} = Select;

    const dispatch = useDispatch();

    const listaStanze = useSelector(stanzeSelector.getStanze);
    const listaUtenti = useSelector(clientiSelector.getClienti);
    const isLoadingStanze = useSelector(stanzeSelector.getIsLoading);
    const isLoadingUtenti = useSelector(clientiSelector.getIsLoading);
    const isErrorStanze = useSelector(stanzeSelector.getIsError);
    const isErrorUtenti = useSelector(clientiSelector.getIsError);

    const [newPrenotazione, setNewPrenotazione] = useState<Partial<PrenotazioneDTO>>();

    const getLocalNome = (): string => {
        if(listaUtenti && newPrenotazione && newPrenotazione.idCliente) {
            const cliente = listaUtenti.find(utente => utente.id === newPrenotazione.idCliente);
            if(cliente) {
                return cliente.nome;
            } else return '';
        } else return '';
    }

    const getLocalCognome = (): string => {
        if(listaUtenti && newPrenotazione && newPrenotazione.idCliente) {
            const cliente = listaUtenti.find(utente => utente.id === newPrenotazione.idCliente);
            if(cliente) {
                return cliente.cognome;
            } else return '';
        } else return '';
    }

    const getLocalTelefono = (): string => {
        if(listaUtenti && newPrenotazione && newPrenotazione.idCliente) {
            const cliente = listaUtenti.find(utente => utente.id === newPrenotazione.idCliente);
            if(cliente) {
                return cliente.telefono;
            } else return '';
        } else return '';
    }

    const getLocalDocumento = (): string => {
        if(listaUtenti && newPrenotazione && newPrenotazione.idCliente) {
            const cliente = listaUtenti.find(utente => utente.id === newPrenotazione.idCliente);
            if(cliente) {
                return cliente.documento;
            } else return '';
        } else return '';
    }

    useEffect(() => {
        dispatch(clientiActions.fetchClienti(1)) // todo handle hotel id
        dispatch(stanzeActions.fetchStanze(1)) // todo handle hotel id
    }, [])

    return (
        <div className={`${componentClassName}`}>
            {
                (!(isLoadingStanze || isLoadingUtenti) && !(isErrorUtenti || isErrorStanze)) ? (
                    <>
                        <div className={`${componentClassName}__inputgroup`}>
                            <Title level={5}>Cliente</Title>
                            <Select
                                style={{width: '100%'}}
                                showSearch
                                placeholder="Cliente"
                                optionFilterProp="children"
                                value={(newPrenotazione && newPrenotazione.idCliente) && newPrenotazione.idCliente}
                                onChange={(value) => {setNewPrenotazione((prevState => ({...prevState, idCliente: value})))}}
                                filterOption={(input, option) =>
                                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={isErrorStanze}
                            >
                                {
                                    (listaUtenti && listaUtenti.length > 0) &&
                                    listaUtenti.map((utente) => (
                                        <Option key={utente.id} value={utente.id}>{utente.nome + ' ' + utente.cognome}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className={`${componentClassName}__inputgroup`}>
                            <div className={`${componentClassName}__inputgroup__name-labels`} >
                                <Title level={5}>
                                    Nome
                                </Title>
                                <Title level={5}>
                                    Cognome
                                </Title>
                            </div>
                            <Input.Group compact>
                                <Input
                                    style={{ width: '50%' }}
                                    placeholder={'Nome'}
                                    disabled={true}
                                    value={getLocalNome()}/>
                                <Input
                                    style={{ width: '50%' }}
                                    placeholder={'Cognome'}
                                    disabled={true}
                                    value={getLocalCognome()}/>
                            </Input.Group>
                        </div>
                        <div className={`${componentClassName}__inputgroup`}>
                            <Title level={5}>
                                Telefono
                            </Title>
                            <Input
                                placeholder="Telefono"
                                value={getLocalTelefono()}
                                disabled={true}/>
                        </div>
                        <div className={`${componentClassName}__inputgroup`}>
                            <Title level={5}>
                                Documento
                            </Title>
                            <Input
                                placeholder="Documento"
                                value={getLocalDocumento()}
                                disabled={true}
                                prefix={<UserOutlined />}/>
                        </div>
                        <div className={`${componentClassName}__inputgroup`}>
                            <Title level={5}>Data check-in</Title>
                            <DatePicker
                                className={`${componentClassName}__inputgroup__datepicker`}
                                onChange={(date) => {
                                    if(date) {
                                        setNewPrenotazione((prevState => ({
                                                ...prevState,
                                                dataInizio: date.toDate()
                                            }
                                        )))
                                    }
                                }}
                            />
                        </div>
                        <div className={`${componentClassName}__inputgroup`}>
                            <Title level={5}>Data check-out</Title>
                            <DatePicker
                                className={`${componentClassName}__inputgroup__datepicker`}
                                onChange={(date) => {
                                    if(date) {
                                        setNewPrenotazione((prevState => ({
                                                ...prevState,
                                                dataFine: date.toDate()
                                            }
                                        )))
                                    }
                                    }}
                            />
                        </div>

                        <div className={`${componentClassName}__inputgroup`}>
                            <Title level={5}>
                                Stanza
                            </Title>
                            <Select
                                style={{width: '100%'}}
                                showSearch
                                placeholder="Stanza"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={(value) => {setNewPrenotazione((prevState => ({...prevState, idStanza: Number(value)})))}}
                            >
                                {

                                    listaStanze && (listaStanze.length > 0) &&
                                    listaStanze.filter((stanza) => !stanza.fuoriServizio).map((stanza) => (
                                        <Option key={stanza.id} value={stanza.id}>{'Stanza ' + stanza.numeroStanza}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <Button onClick={() => {
                            if(newPrenotazione && newPrenotazione.idCliente && newPrenotazione.idStanza && newPrenotazione.dataInizio && newPrenotazione.dataFine) {
                                console.log('prova')
                                dispatch(prenotazioniActions.addPrenotazione({
                                    ...newPrenotazione,
                                    idHotel: 1 // todo handle hotel id
                                }))
                            }
                        }}>Conferma</Button>
                    </>
                ) : (
                    <Spin size={'large'}/>
                )
            }


        </div>
    )
}

export default NewServizio;
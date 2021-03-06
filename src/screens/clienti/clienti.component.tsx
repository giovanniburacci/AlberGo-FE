import React, {useEffect, useState} from 'react';
import './clienti.scss'
import {ColumnsType} from 'antd/es/table';
import {Drawer, Empty, Table} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {Spin} from 'antd';
import {ClienteDTO} from '../../models/models';
import clientiSelector from '../../store/clienti/clienti.selector';
import clientiActions from '../../store/clienti/clienti.action';
import ClientiFilters from './clientiFilters/clientiFilters.component';
import DettaglioCliente from './dettaglioCliente/dettaglioCliente.component';
import hotelSelector from '../../store/hotel/hotel.selector';

const componentClassName = 'Clienti';
const columns:ColumnsType<ClienteDTO> = [{
    title: 'Nome',
    dataIndex: 'nome',
    key: 'nome',
},
    {
        title: 'Cognome',
        dataIndex: 'cognome',
        key: 'cognome'
    },
    {
        title: 'Numero di telefono',
        dataIndex: 'telefono',
        key: 'telefono',
    },
    {
        title: 'Numero del documento',
        dataIndex: 'documento',
        key: 'documento'
    }];
const Clienti = () => {

    const dispatch = useDispatch();
    const [selectedCliente, setSelectedCliente] = useState<ClienteDTO | undefined>();

    const isLoading = useSelector(clientiSelector.getIsLoading);
    const isError = useSelector(clientiSelector.getIsError);
    const clienti = useSelector(clientiSelector.getClienti);
    const idHotel = useSelector(hotelSelector.getHotelId)

    useEffect(() => {
        if(idHotel) {
            dispatch(clientiActions.fetchClienti(idHotel))
        }
    }, [idHotel])

    const selectCliente = (record:ClienteDTO) => {
        setSelectedCliente(record);
    }

    return (
        <>
            <div className={`${componentClassName}`}>
                <ClientiFilters />
                {
                    isLoading ? (
                        <Spin size={'large'}/>
                    ) : isError ? (
                        <Empty />
                    ) : (
                        <Table
                            onRow={(record,index) => {
                                return {
                                    onClick: () => {selectCliente(record)}
                                }
                            }}
                            columns={columns}
                            dataSource={clienti}
                            pagination={false}
                            rowKey={(row) => row.id}
                        />
                    )
                }
            </div>
            <Drawer
                destroyOnClose={true}
                visible={!!selectedCliente}
                onClose={() => {setSelectedCliente(undefined)}}
                title={'Dettaglio cliente'}
                width={'348px'}>
                { selectedCliente && (
                    <DettaglioCliente selectedCliente={selectedCliente}/>
                )
                }
            </Drawer>
        </>
    )
}

export default Clienti;
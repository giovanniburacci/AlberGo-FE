import React from 'react';
import './prenotazioniBar.scss'
import {Button, Input} from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import PrenotazioniFilters from './prenotazioniFilters/prenotazioniFilters.component';
const componentClassName = 'PrenotazioniBar'

interface PrenotazioniBarProps {
    setHasClickedNew: () => void
}
const PrenotazioniBar = (props:PrenotazioniBarProps) => {
    const {setHasClickedNew} = props;
    return (
        <div className={`${componentClassName}`}>
            <div className={`${componentClassName}__box`}>
                <PrenotazioniFilters />
            </div>
            <div className={`${componentClassName}__box`}>
                <Button type={'primary'} onClick={setHasClickedNew} icon={<PlusCircleOutlined />}>
                    Nuova
                </Button>
            </div>
        </div>
    )
}

export default React.memo(PrenotazioniBar, (prevProps,nextProps) => prevProps !== nextProps);
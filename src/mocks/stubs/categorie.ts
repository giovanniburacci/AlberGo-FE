import {CategoriaDTO} from '../../models/models';

export const getCategorieStub = ():CategoriaDTO[] => {

    const categorie:CategoriaDTO[] = [];
    for(let i = 0; i<10; i++) {
        categorie.push({
            descrizioneCategoria: 'Descrizione cat'+i,
            idCategoria: ''+i,
            idHotel: ''+i,
            nome: 'cat'+i,
            prezzo: 30
        });
    }
    return categorie;
}
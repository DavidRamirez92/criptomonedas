import React, {useEffect,useState} from 'react';
import styled from '@emotion/styled';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import axios from 'axios';
import Error from './Error';

const Boton = styled.input `
    margin-top: 20px;
    font-weight: bold;
    font-size:20px;
    padding:10px;
    background-color:#66a2fe;
    border:none;
    width:100%;
    border-radius:10px;
    color:#FFF;
    transition:background-color .3s ease;

    &:hover {
        background-color:#326ac0;
        cursor:pointer;
    }
`;

const Formulario = ({guardarMoneda,guardarCriptomoneda}) => {

    //State del listado de criptomonedas
    const [listaCripto,guardarCriptomonedas] = useState([]);
    const [error,guardarError] = useState(false);

    const MONEDAS =  [
        {codigo:'USD',nombre:'Dolar de Estados Unidos'},
        {codigo:'MXN',nombre:'Peso Mexicano'},
        {codigo:'EUR',nombre:'Euro'},
        {codigo:'GBP',nombre:'Libra Esterlina'},
        {codigo:'ARS',nombre:'Peso Argentino'}
    ]

    //Utilizar useMoneda
    const[moneda,SelectMonedas] = useMoneda('Elige tu moneda','',MONEDAS);

    //Utilizar useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu Criptomoneda','',listaCripto);

    //Ejecutar llamado a la API
    useEffect(() =>{
        const consultarAPI = async() => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    },[]);
    //Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        //Validar si ambos campos estan llenos.
        if(moneda===''|| criptomoneda===''){
            guardarError(true);
            return;
        }

        //pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }

    return ( 
        <form
            onSubmit= {cotizarMoneda}
        >
            {error&&<Error mensaje="Todos los Campos son obligatorios"/>}
            <SelectMonedas />

            <SelectCripto />
            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
     );
}
 
export default Formulario;
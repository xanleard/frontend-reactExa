import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';

export const CarroForm = ({ fetchCarros, CarroSeleccionado, acccion, onDismiss }) => {
    const [carro, setCarro] = useState({
        id: acccion === 'Edit' ? CarroSeleccionado.id : 0,
        nombre: acccion === 'Edit' ? CarroSeleccionado.nombre : '',
        anio: acccion === 'Edit' ? CarroSeleccionado.anio : 0,
        modeloId: acccion === 'Edit' ? CarroSeleccionado.modeloId : 0,
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: '',
        anio: '',
        modeloId: '',
    });

    const [modelos, setModelos] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchModelos = async () => {
            const response = await restClient.httpGet('/modelo');

            if (response && response.length) {
                setModelos(response.map(modelo => ({
                    key: modelo.id,
                    text: modelo.nombre
                })))
            }
        }

        fetchModelos();
    }, []);
    
    const handleTextFieldChange = prop => (event, value) => {
        setCarro({ ...carro, [prop]: value })
    }

    const handleSelectedModeloChange = (event, option) => {
        setCarro({ ...carro, modeloId: option.key });
    }


    const validandoCampos = () => {
        let mensaje = {};

        if (!carro.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }

        if (carro.anio < 0) {
            mensaje = { ...mensaje, edad: 'Edad debe sera mayor o igual a 0' };
        }

        if (!carro.modeloId) {
            mensaje = { ...mensaje, cursoId: 'Seleccione un modelo...' };
        }
       

        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Carro', carro);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchCarros();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Carro/${CarroSeleccionado.id}`;

        const response = await restClient.httpPut(url, carro);
        if (response === 'success') {
            setMensajeValidacion('Saved');

            fetchCarros();
        } else {
            setMensajeValidacion(response);
        }

        setShowSpinner(false);
        onDismiss();
    }

    return (
        <div>

            {showSpinner && <ProgressIndicator label="Guardando..." />}

            <TextField label="Nombre"
                value={carro.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

            <TextField type="Number" label="Año"
                value={carro.anio}
                onChange={handleTextFieldChange('anio')}
                errorMessage={errorCampo.anio} />

            <Dropdown label="Seleccione un modelo"
                options={modelos}
                selectedKey={carro.modeloId}
                onChange={handleSelectedModeloChange}
                errorMessage={errorCampo.modeloId} />

           

            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}
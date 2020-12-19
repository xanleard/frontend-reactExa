import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';

export const ModeloForm = ({ fetchModelos, ModeloSeleccionado, acccion, onDismiss }) => {  
    const [modelo, setModelo] = useState({
        id: acccion === 'Edit' ? ModeloSeleccionado.id : 0,
        nombre: acccion === 'Edit' ? ModeloSeleccionado.nombre : '',
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: '',
    });


    const [showSpinner, setShowSpinner] = useState(false);

    const handleTextFieldChange = prop => (event, value) => {
        setModelo({ ...modelo, [prop]: value })
    }



    const validandoCampos = () => {
        let mensaje = {};

        if (!modelo.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }
       
        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Modelo', modelo);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchModelos();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Modelo/${ModeloSeleccionado.id}`;

        const response = await restClient.httpPut(url, modelo);
        if (response === 'success') {
            setMensajeValidacion('Saved');

            fetchModelos();
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
                value={modelo.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

           

            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}
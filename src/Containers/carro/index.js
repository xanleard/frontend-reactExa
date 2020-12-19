import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './carro.css'
import { restClient } from '../../Services/restClient';
import { CarroForm } from './carroForm';

export const Carro = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [carros, setCarros] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.curso.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [carro, setCarro] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchCarros();
    }, []);

    const fetchCarros = async () => {
        const response = await restClient.httpGet('/carro');

        if (!response.length) {
            return;
        }

        setCarros(response.map(item => ({ ...item, nombreModelo: item.modelo.nombre })));
    }

    const handleRefreshClick = () => {
        setCarros(undefined);

        fetchCarros();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoCarroClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveCarroClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setCarro(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchCarro = value => {

        if(!value){
            setCarros(undefined);
            setFiltro([]);
            fetchCarros();

            return;
        }

        const dataFilter = carros && carros.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditCarroClick = () => {
        if (!carro) return 'Selecione un Carro';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverCarroClick = async () => {
        if (!carro) return;

        const response = await restClient.httpDelete('/carro', carro.id);

        if (response === 'success') {
            handleDismissAlertClick();
            setCarros(undefined);
            fetchCarros();
        }
    }

    const handleNoRemoverCarroClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditCarroClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveCarroClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Carro', fieldName: 'nombre', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column3', name: 'Alo', fieldName: 'anio', minWidth: 100, maxWidth: 200, isResizable: true },

        { key: 'column5', name: 'Nombre del modelo', fieldName: 'nombreModelo', minWidth: 100, maxWidth: 200, isResizable: true },
    ]

    const isDisableButton = carro ? false : true;

    return (
        <div className="carro">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Refresh',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newCarro',
                    text: 'New',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoCarroClick,
                },
                {
                    key: 'removeCarro',
                    text: 'Remove',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveCarroClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarCarro',
                    text: 'Editar Carro',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditCarroClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchCarro} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : carros}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!carros}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Carro" : "Editar Carro"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <CarroForm // Este es el formulario que contiene los controles con la información
                    fetchCarros={fetchCarros} // Hace un GET a la API
                    CarroSeleccionado={carro || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick} 
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Remove Carro',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Remover Carro?',
                }}
                modalProps={{
                    titleAriaId: '',
                    subtitleAriaId: '',
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } },
                }}
            >
                
                <DialogFooter 
                // Esto muestra los dos botones en la parte inferior, conultando se desea o no eliminar el registro
                > 
                    <PrimaryButton onClick={handleRemoverCarroClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverCarroClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}
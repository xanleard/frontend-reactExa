import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './modelo.css'
import { restClient } from '../../Services/restClient';
import { ModeloForm } from './modeloForm';

export const Modelo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [modelos, setModelos] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.curso.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [modelo, setModelo] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchModelos();
    }, []);

    const fetchModelos = async () => {
        const response = await restClient.httpGet('/modelo');
        console.log(response);
        if (!response.length) {
            return;
        }

        setModelos(response.map(item => ({ ...item })));
    }

    const handleRefreshClick = () => {
        setModelos(undefined);

        fetchModelos();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoModeloClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveModeloClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();
console.log(itemSeleccionado);
            setModelo(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchModelo = value => {

        if(!value){
            setModelos(undefined);
            setFiltro([]);
            fetchModelos();

            return;
        }

        const dataFilter = modelos && modelos.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditModeloClick = () => {
        if (!modelo) return 'Selecione un Modelo';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverModeloClick = async () => {
        if (!modelo) return;

        const response = await restClient.httpDelete('/modelo', modelo.id);
        console.log(response)
        if (response === 'success') {
            handleDismissAlertClick();
            setModelos(undefined);
            fetchModelos();
        }
    }

    const handleNoRemoverModeloClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditModeloClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveModeloClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Modelo', fieldName: 'nombre', minWidth: 100, maxWidth: 200, isResizable: true },
       
    ]

    const isDisableButton = modelo ? false : true;

    return (
        <div className="modelo">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Refresh',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newModelo',
                    text: 'New',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoModeloClick,
                },
                {
                    key: 'removeModelo',
                    text: 'Remove',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveModeloClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarModelo',
                    text: 'Editar Modelo',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditModeloClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchModelo} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : modelos}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!modelos}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Modelo" : "Editar Modelo"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <ModeloForm // Este es el formulario que contiene los controles con la información
                    fetchModelos={fetchModelos} // Hace un GET a la API
                    ModeloSeleccionado={modelo || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick} 
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Remove Modelo',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Remover Modelo?',
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
                    <PrimaryButton onClick={handleRemoverModeloClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverModeloClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}
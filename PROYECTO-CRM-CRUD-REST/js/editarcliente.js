import { editarCliente, obtenerCliente } from "./API.js";
import {validarDatos,mostrarAlerta} from './funciones.js';

(function(){


    
    document.addEventListener('DOMContentLoaded',datosEditar);
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit',editar);

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const idInput = document.querySelector('#id');

    function editar(e){

        e.preventDefault();
   
        const cliente = {
            nombre : nombreInput.value,
            email: emailInput.value,
            telefono : telefonoInput.value,
            empresa: empresaInput.value,
            id: parseInt(idInput.value)
        }

        if(!validarDatos(cliente)){
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }

        editarCliente(cliente);

    };

    async function datosEditar(){

        const urlSearch = new URLSearchParams(window.location.search);
        const idCliente = urlSearch.get('id');

        const cliente = await obtenerCliente(idCliente);
        
        const {nombre,email,telefono,empresa,id} = cliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
        idInput.value = id;

    }


    


})()
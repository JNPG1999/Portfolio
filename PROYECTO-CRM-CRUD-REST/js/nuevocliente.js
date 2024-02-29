import {validarDatos,mostrarAlerta} from './funciones.js';
import { agregarCliente } from './API.js';

(function(){

    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit',validarCliente);


    function validarCliente(e){

        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        };

        if(!validarDatos(cliente)){
            mostrarAlerta('Todos los datos son requeridos');
            return;
        }

        agregarCliente(cliente);

    }



})()


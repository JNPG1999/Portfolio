import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario
} from './selectores.js';

import UI from './clases/UI.js';
import Citas from './clases/Citas.js';

const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

let editando;

const objDatos = {

    mascota:'',
    propietario:'',
    telefono:'',
    fecha:'',
    hora:'',
    sintomas:''

}

export function datosCita(e){

    objDatos[e.target.name] = e.target.value;

}

export function crearCita(e){

    e.preventDefault();

    const {mascota,propietario,telefono,fecha,hora,sintomas} = objDatos;

    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas ===''){

        ui.mostrarAlerta('Todos los campos son obligatorios','error');
        return;
    }

    if(editando){

        ui.mostrarAlerta('Editado correctamente');

        administrarCitas.editarCita({...objDatos});

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false;

    }else{

        objDatos.id = Date.now();

        //Mostrando un mensaje si los datos de la cita son validos
        ui.mostrarAlerta('Cita agregada correctamente');

        //Agregando la cita a la Lista de Citas
        administrarCitas.listaCitas({...objDatos});

    }
    
    //Reiniciando el objeto 
    limpiarObjeto();
    
    //Reiniciar formulario
    formulario.reset();

    //Agregando la cita al HTML
    ui.mostrarCita(administrarCitas);
}

export function limpiarObjeto(){

    objDatos.mascota = '';
    objDatos.propietario = '';
    objDatos.telefono = '';
    objDatos.fecha = '';
    objDatos.hora = '';
    objDatos.sintomas = '';

}

export function eliminarCita(id){

    administrarCitas.borrarCita(id);

    ui.mostrarAlerta('La cita se elimino correctamente');

    ui.mostrarCita(administrarCitas);

}

export function editarCita(cita){

    const {mascota,propietario,telefono,fecha,hora,sintomas} = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    objDatos.mascota = mascota;
    objDatos.propietario = propietario;
    objDatos.telefono = telefono;
    objDatos.fecha = fecha;
    objDatos.hora = hora;
    objDatos.sintomas = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}
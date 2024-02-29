import {
    eliminarCita,
    editarCita
} from '../funciones.js';
import {selectCitas} from '../selectores.js';

class UI{

    constructor({citas}){
        this.textoHeading(citas);
    }

    mostrarAlerta(mensaje,tipo){

        const divAlerta  = document.createElement('DIV');

        divAlerta.classList.add('text-center','alert','d-block','col-12')

        divAlerta.textContent = mensaje;

        if(tipo === 'error'){

            divAlerta.classList.add('alert-danger');

        }else{

            divAlerta.classList.add('alert-success');

        }

        document.querySelector('#contenido').insertBefore(divAlerta,document.querySelector('.agregar-cita'));

        setTimeout(()=>{

            divAlerta.remove();

        },3000);

    }

    mostrarCita(listaCitas){

        const {citas} = listaCitas;

        this.limpiarHTML();

        citas.forEach(cita => {
            
            const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;
            
            const divCita = document.createElement('DIV');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id;

            //Nombre de la mascota
            const tituloCita = document.createElement('H2');
            tituloCita.classList.add('card-title','font-weight-bolder');
            tituloCita.textContent = mascota;

            //Nombre del propietario
            const propietarioCita = document.createElement('P');
            propietarioCita.classList.add('mb-0');
            propietarioCita.innerHTML = `<span class='font-weight-bolder'>Propietario: </span> ${propietario}`;
            
            //Telefono
            const telefonoCita = document.createElement('P');
            telefonoCita.classList.add('mb-0');
            telefonoCita.innerHTML = `<span class='font-weight-bolder'>Telefono: </span> ${telefono}`;

            //Fecha
            const fechaCita = document.createElement('P');
            fechaCita.classList.add('mb-0');
            fechaCita.innerHTML = `<span class='font-weight-bolder'>Fecha: </span> ${fecha}`;

            //Hora
            const horaCita = document.createElement('P');
            horaCita.classList.add('mb-0');
            horaCita.innerHTML = `<span class='font-weight-bolder'>Hora: </span> ${hora}`;

            //Sintomas
            const sintomasCita = document.createElement('P');
            sintomasCita.classList.add('mb-0');
            sintomasCita.innerHTML = `<span class='font-weight-bolder'>Sintomas: </span> ${sintomas}`;

            //Creando el boton de eliminar
            const botonEliminar = document.createElement('BUTTON');
            botonEliminar.classList.add('btn','btn-danger','mr-2');
            botonEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>`
          

            botonEliminar.onclick = ()=> eliminarCita(id);
            

            //Creando el boton Editas
            const botonEditar = document.createElement('BUTTON');
            botonEditar.classList.add('btn','btn-info','mr-2');
            botonEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>`
            
            botonEditar.onclick = ()=> editarCita(cita);
          
            divCita.appendChild(tituloCita);
            divCita.appendChild(propietarioCita);
            divCita.appendChild(telefonoCita);
            divCita.appendChild(fechaCita);
            divCita.appendChild(horaCita);
            divCita.appendChild(sintomasCita);
            divCita.appendChild(botonEliminar);
            divCita.appendChild(botonEditar);

            selectCitas.appendChild(divCita);

        });

    }

    limpiarHTML(){
        while(selectCitas.firstChild){
            selectCitas.removeChild(selectCitas.firstChild);
        }
    }

    textoHeading(citas){
        if(citas.length > 0){
            document.querySelector('#administra').textContent = 'Administra tus Citas';
        }else{
            document.querySelector('#administra').textContent = 'No hay Citas, comienza creando una';
        }

    }

}

export default UI;





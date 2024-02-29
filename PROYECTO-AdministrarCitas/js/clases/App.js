import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario
} from '../selectores.js';

import {
    crearCita,
    datosCita
} from '../funciones.js'

class App{

    constructor(){
        this.iniciarApp();
    }

    iniciarApp(){
        formulario.addEventListener('submit',crearCita);

        mascotaInput.addEventListener('input',datosCita);
        propietarioInput.addEventListener('input',datosCita);
        telefonoInput.addEventListener('input',datosCita);
        fechaInput.addEventListener('input',datosCita);
        horaInput.addEventListener('input',datosCita);
        sintomasInput.addEventListener('input',datosCita);
        document.addEventListener('DOMContentLoaded',()=> formulario.reset());
    }

}

export default App;
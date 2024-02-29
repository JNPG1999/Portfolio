//Variables

let presupuesto;

//Selectores

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos

document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
formulario.addEventListener('submit',agregarGasto);

//Clases

class Presupuesto{

    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){

        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();

    }

    calcularRestante(){
        const nuevoRestante = this.gastos.reduce((total,gasto)=>total + Number(gasto.cantidadValue),0);

        this.restante = this.presupuesto - nuevoRestante;

    }

    eliminarGasto(id){

        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

    }
}

class UI {

    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad;

        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }
    
    mostrarAlerta(mensaje,tipo){

        const div = document.createElement('DIV');

        div.classList.add('text-center','alert');
        
        if(tipo ==='error'){
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success');
        }

        div.textContent = mensaje;

        document.querySelector('.primario').insertBefore(div,formulario);

        setTimeout(()=>{
            div.remove();
        },3000)
        
    }

    mostrarGastos(gastos){
        
        this.limpiarHTML();

        gastos.forEach(gasto => {

            const {gastoValue,cantidadValue,id} = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('LI');

            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
                                    ${gastoValue} <span class='badge badge-primary badge-pill'> $ ${cantidadValue}</span>
            `;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            };
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');

            // Agregar al HTML
            nuevoGasto.appendChild(btnBorrar)
            gastoListado.appendChild(nuevoGasto);

        });

    }

    //Para limpiar el HTML
    limpiarHTML(){
        while (gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        if(( presupuesto / 4 ) > restante){

            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');

        }else if(( presupuesto / 2 ) > restante){

            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');

        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor

        if(restante <=0){
            ui.mostrarAlerta('El presupuesto se a agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
            return;
        }

    }

}

const ui = new UI();

//Funciones

function preguntarPresupuesto(){

    const presupuestoUsuario = prompt(' Cual es su presupuesto? ');
    
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){ 

        window.location.reload();

    }   

    //instanciando presupuesto
    
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

    formulario.reset();
}

function agregarGasto(e){
     e.preventDefault();

    const gastoValue = document.querySelector('#gasto').value;
    const cantidadValue = Number(document.querySelector('#cantidad').value);

    if(gastoValue === '' || cantidadValue === ''){

        ui.mostrarAlerta('Ambos campos son necesario','error');
        return;

    }else if(cantidadValue <= 0 || isNaN(cantidadValue)){

        ui.mostrarAlerta('Cantidad no valida','error');
        return;

    }

    const gasto = {gastoValue, cantidadValue, id: Date.now()};

    //Agregamos el gasto añadido a la lista
    presupuesto.nuevoGasto(gasto);

    ui.mostrarAlerta('Gasto agregado correctamente');

    const {gastos,restante} = presupuesto; //Quiero una llave que tiene el mismo nombre asi que ya no la declaro en el destructuring

    ui.mostrarGastos(gastos);
    
    //console.log(restante);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    formulario.reset();
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);

}


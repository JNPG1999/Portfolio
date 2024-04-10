//Variables 
const formulario = document.querySelector('#agregar-gasto');
const selectGastos = document.querySelector('#gastos ul');
let presupuestoInicial;
let presupuesto;
let sumaGastos;


//Clases

class Presupuesto{

    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    listaGastos(gasto){
        
        this.gastos = [...this.gastos,gasto];

        this.calcularRestanteAgregar();
    }

    calcularRestanteAgregar(){

        /*
        sumaGastos = this.gastos.reduce((total,gasto) => total + Number( gasto.cantidadGasto ), 0);

        this.restante = this.presupuesto - sumaGastos;*/

        
        sumaGastos = this.gastos.reduce((total,gasto) => total + Number( gasto.cantidadGasto ), 0);

        if (sumaGastos <= this.presupuesto){
            
            this.restante = this.presupuesto - sumaGastos;
            console.log(this.presupuesto,sumaGastos);

        }else{
            this.gastos.pop();
            console.log(this.gastos);
        }

    }

    gastoBorrar(){

            sumaGastos = this.gastos.reduce((total,gasto) => total + Number( gasto.cantidadGasto ), 0);

            this.restante = this.presupuesto - sumaGastos;
    }

    borrarGasto(id){

        this.gastos = this.gastos.filter(gasto => gasto.id !== id);

        this.gastoBorrar();

    }

}


class UI{

    mostrarPresupuesto(cantidad,restante){
        document.querySelector('#total').textContent = cantidad;
        document.querySelector('#restante').textContent = restante;
    }

    mostrarAlerta(mensaje,tipo){

        const divAlerta = document.createElement('DIV');

        divAlerta.classList.add('alert','text-center');
        divAlerta.textContent = mensaje;

        if(tipo === 'error'){
            divAlerta.classList.add('alert-danger');
        }else{
            divAlerta.classList.add('alert-success');
        }

        document.querySelector('.primario').insertBefore(divAlerta,formulario);

        setTimeout(()=>{

            divAlerta.remove();

        },3000);

    }

    mostrarGastos(gastos){

        this.limpiarHTML();

        gastos.forEach(gasto => {

            const {nombreGasto,cantidadGasto,id} = gasto;
            
            const li = document.createElement('LI');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id=id;

            li.innerHTML =`<span>${nombreGasto}</span> <span class="badge badge-primary badge-pill">$ ${cantidadGasto}</span>`
            
            const btnBorra = document.createElement('BUTTON');
            btnBorra.classList.add('btn','btn-danger');
            btnBorra.innerHTML='Borrar &times';
            btnBorra.onclick = ()=>{
                borrarGasto(id);
            }

            li.appendChild(btnBorra);
            selectGastos.appendChild(li);

        });



    }

    limpiarHTML(){
        while(selectGastos.firstChild){
            selectGastos.removeChild(selectGastos.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    colorRestante(presupuestoObj){

        const {presupuesto,restante} = presupuestoObj;

        const divRestante = document.querySelector('.restante');

        if(( presupuesto / 4 ) > restante){

            divRestante.classList.remove('alert-success');
            divRestante.classList.add('alert-danger');

        }else if(( presupuesto / 2 ) > restante){
            divRestante.classList.remove('alert-success','alert-danger');
            divRestante.classList.add('alert-warning');
        }else{
            divRestante.classList.remove('alert-warning','alert-danger');
            divRestante.classList.add('alert-success');
        }

        if(restante<=0){

            this.mostrarAlerta('Su presupuesto se a agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;

        }else{
            formulario.querySelector('button[type="submit"]').disabled = false;
        }


    }

}

const ui = new UI();

//Eventos


document.addEventListener('DOMContentLoaded',iniciarPagina);

formulario.addEventListener('submit',agregaGasto);

//Funciones

function iniciarPagina(){

    presupuestoInicial = prompt('Cual es su presupuesto?');

    if(presupuestoInicial === '' || presupuestoInicial === null || isNaN(presupuestoInicial) || presupuestoInicial <= 0 ){

        window.location.reload();

    }

    //Instanciando Presupuesto
    presupuesto = new Presupuesto(presupuestoInicial);

    //Obteniendo los valores de la instancia presupuesto
    const {restante} = presupuesto;

    ui.mostrarPresupuesto(presupuestoInicial,restante);

    formulario.reset();
}

function agregaGasto(e){
    e.preventDefault();

    const nombreGasto = document.querySelector('#gasto').value;
    const cantidadGasto = document.querySelector('#cantidad').value;

    if(nombreGasto==='' || cantidadGasto ===''){

        ui.mostrarAlerta('Ambos campos son obligatorios','error');
        return;
    }
    else if( cantidadGasto <= 0 || isNaN(cantidadGasto)) {

        ui.mostrarAlerta('Cantidad invalida','error');
        return;

    }else if(Number(cantidadGasto) > presupuestoInicial){

        ui.mostrarAlerta('Esta cantidad es mayor al presupuesto','error');
        return;

    }

    //Creando un objeto que contendra los valores
    const gasto = {nombreGasto, cantidadGasto, id: Date.now()};
    
    //Agregamos los gastos a una lista
    presupuesto.listaGastos(gasto);
    
    //Cogemos los valores de presupuesto
    const {gastos,restante} = presupuesto;

    //Mostrando los gastos de la lista
    console.log(`gasto: ${cantidadGasto},suma: ${sumaGastos},restante: ${restante}`);

    if(sumaGastos >= cantidadGasto && restante >= 0 && sumaGastos<= presupuestoInicial){

        ui.mostrarGastos(gastos);
    
        ui.actualizarRestante(restante);
    
        ui.colorRestante(presupuesto);
    
        ui.mostrarAlerta('Gasto agregado correctamente');
    
        formulario.reset();

    }else{
        ui.mostrarAlerta('La cantidad sobrepasa el restante','error');
        return;
    }



    
    //Mostrando el nuevo valor restante
    
}

function borrarGasto(id){

    presupuesto.borrarGasto(id);

    const{gastos,restante} = presupuesto;

    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.colorRestante(presupuesto);
    

}

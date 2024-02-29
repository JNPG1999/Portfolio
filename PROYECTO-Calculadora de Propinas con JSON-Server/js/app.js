const guardarCliente = document.querySelector('#guardar-cliente');
guardarCliente.addEventListener('click',datosPedido);

let cliente = {

    mesa:'',
    hora:'',
    pedidos:[]

}

function datosPedido(){

    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa,hora].some(campo => campo === '');

    if(camposVacios){
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alertaDiv = document.createElement('DIV');
            alertaDiv.classList.add('invalid-feedback','d-block','text-center');
            alertaDiv.textContent = 'Todos los campos son obligatorios';
    
            document.querySelector('.modal-body').appendChild(alertaDiv);
    
            setTimeout(()=>{
                alertaDiv.remove();
            },3000)
        }

        return;
    }

    cliente = {...cliente,mesa,hora};
    
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    mostrandoSecciones();
    
    consultandoAPI();
}

function mostrandoSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(etiqueta => etiqueta.classList.remove('d-none'));
}

function consultandoAPI(){

    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => seccionPlatillos(resultado))
        .catch(error => console.log(error));
}

function seccionPlatillos(platillos){

    const contenido = document.querySelector('.contenido');

    platillos.forEach(platillo => {

        const {id,nombre,precio,categoria} = platillo;
        const categoriaResuelta = (categoria === 1) ? 'Comida' : (categoria === 2 ? 'Bebidas' : 'Postres');

        const platilloDiv = document.createElement('DIV');
        platilloDiv.classList.add('row','py-3','border-top');

        const nombrePlatillo = document.createElement('DIV');
        nombrePlatillo.classList.add('col-md-4');
        nombrePlatillo.textContent = `${nombre}`;

        const precioPlatillo = document.createElement('DIV');
        precioPlatillo.classList.add('col-md-3','fw-bold');
        precioPlatillo.textContent = `$ ${precio}`;

        const categoriaPlatillo = document.createElement('DIV');
        categoriaPlatillo.classList.add('col-md-3');
        categoriaPlatillo.textContent = `${categoriaResuelta}`;

        const cantidadPlatillo = document.createElement('DIV');
        cantidadPlatillo.classList.add('col-md-2');

        const input = document.createElement('INPUT');
        input.classList.add('form-control');
        input.id= `producto-${id}`;
        input.type = 'number';
        input.value = 0;
        input.min = 0;

        input.onchange = function(){

            const cantidad = parseInt(input.value);
            agregarPlatillo({...platillo,cantidad});
            
        }
        
        platilloDiv.appendChild(nombrePlatillo);
        platilloDiv.appendChild(precioPlatillo);
        platilloDiv.appendChild(categoriaPlatillo);
        cantidadPlatillo.appendChild(input);
        platilloDiv.appendChild(cantidadPlatillo);

        contenido.appendChild(platilloDiv);
    }); 

}

function agregarPlatillo(producto){

    let { pedidos } = cliente;
    
    if (producto.cantidad > 0) {

        if (pedidos.some(platillo => platillo.id === producto.id)){
            const productosActualizado = pedidos.map( platillo =>{

                if (platillo.id === producto.id) {
                    platillo.cantidad = producto.cantidad;
                }
                return platillo;

            });

            cliente.pedidos = [...productosActualizado];

        }else{
            cliente.pedidos = [...pedidos,producto];
        }

        
   }else{

        const eliminandoProducto = pedidos.filter(platillo => platillo.id !== producto.id);
        cliente.pedidos = [...eliminandoProducto];
        
   }

   limpiarHTML();

   if(cliente.pedidos.length){

        actualizarResumen();
        formularioPropina(cliente.pedidos);

   }else{

        crearParrafo();

   }
       
}

function formularioPropina(pedidos){

    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('DIV');
    
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow','propina');

    const heading = document.createElement('H3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina';

    //Creando input 10%
    const radioDiv10 = document.createElement('DIV');
    radioDiv10.classList.add('form-check');
    
    const radioInput10 = document.createElement('INPUT');
    radioInput10.classList.add('form-check-input');
    radioInput10.type = 'radio';
    radioInput10.id = 'propina-10';
    radioInput10.dataset.propina = '10';
    radioInput10.name = 'propinas';

    radioInput10.onchange = ()=>{

        valoresPropina(pedidos,radioInput10.dataset.propina);

    }

    const radioLabel10 = document.createElement('LABEL');
    radioLabel10.classList.add('form-check-label');
    radioLabel10.for = 'propina-10';
    radioLabel10.textContent = '10%';

     //Creando input 25%
    const radioDiv25 = document.createElement('DIV');
    radioDiv25.classList.add('form-check');

    const radioInput25 = document.createElement('INPUT');
    radioInput25.classList.add('form-check-input');
    radioInput25.type = 'radio';
    radioInput25.id = 'propina-25';
    radioInput25.dataset.propina = '25';
    radioInput25.name = 'propinas';

    radioInput25.onchange = ()=>{

        valoresPropina(pedidos,radioInput25.dataset.propina);

    }

    const radioLabel25 = document.createElement('LABEL');
    radioLabel25.classList.add('form-check-label');
    radioLabel25.for = 'propina-25';
    radioLabel25.textContent = '25%';

     //Creando input 50%
    const radioDiv50 = document.createElement('DIV');
    radioDiv50.classList.add('form-check');
    
    const radioInput50 = document.createElement('INPUT');
    radioInput50.classList.add('form-check-input');
    radioInput50.type = 'radio';
    radioInput50.id = 'propina-50';
    radioInput50.dataset.propina = '50';
    radioInput50.name = 'propinas';

    radioInput50.onchange = ()=>{


        valoresPropina(pedidos,radioInput50.dataset.propina);

    }

    const radioLabel50 = document.createElement('LABEL');
    radioLabel50.classList.add('form-check-label');
    radioLabel50.for = 'propina-50';
    radioLabel50.textContent = '50%';

    resumen.appendChild(heading);

    radioDiv10.appendChild(radioInput10);
    radioDiv10.appendChild(radioLabel10);
    resumen.appendChild(radioDiv10);

    radioDiv25.appendChild(radioInput25);
    radioDiv25.appendChild(radioLabel25);
    resumen.appendChild(radioDiv25);

    radioDiv50.appendChild(radioInput50);
    radioDiv50.appendChild(radioLabel50);
    resumen.appendChild(radioDiv50);

    contenido.appendChild(resumen);

}

function valoresPropina(pedidos,porcentaje){
    const contenido = document.querySelector('#resumen .contenido .propina');
        
    const resumenPropina = document.createElement('DIV');
    resumenPropina.id = 'resumen-propina';

    const divPropina = document.querySelector('#resumen-propina');
    
    if (divPropina){
        divPropina.remove();
    }

    const subTotal = pedidos.reduce((subTotal,platillo) => subTotal + platillo.precio*platillo.cantidad, 0);

    const subTotalParrafo = document.createElement('P');
    subTotalParrafo.classList.add('fw-bold','h5','mt-3');
    subTotalParrafo.textContent = 'Subtotal Consumo: ';

    const subTotalSpan = document.createElement('SPAN');
    subTotalSpan.classList.add('fw-normal');
    subTotalSpan.textContent=`$${subTotal}`;

    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fw-bold','h5','my-2');
    propinaParrafo.textContent = `Propina: `;

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    let propina = subTotal*parseInt(porcentaje)/100;
    propinaSpan.textContent=`$${propina}`;

    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fw-bold','h5','my-2');
    totalParrafo.textContent = `Total a pagar: `;

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent=`$${subTotal+propina}`;
    
    subTotalParrafo.appendChild(subTotalSpan);
    propinaParrafo.appendChild(propinaSpan);
    totalParrafo.appendChild(totalSpan);

    resumenPropina.appendChild(subTotalParrafo);
    resumenPropina.appendChild(propinaParrafo);
    resumenPropina.appendChild(totalParrafo);

    contenido.appendChild(resumenPropina);

}

function actualizarResumen(){

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow');
    
    const heading = document.createElement('H3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Platillos consumidos';

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const spanMesa = document.createElement('SPAN');
    spanMesa.textContent = cliente.mesa;
    spanMesa.classList.add('fw-normal');

    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const spanHora = document.createElement('SPAN');
    spanHora.textContent = cliente.hora;
    spanHora.classList.add('fw-normal');

    resumen.appendChild(heading);

    mesa.appendChild(spanMesa);
    hora.appendChild(spanHora);

    resumen.appendChild(mesa);
    resumen.appendChild(hora);

    contenido.appendChild(resumen);

    const listaGrupo = document.createElement('UL');
    listaGrupo.classList.add('list-group');

    const {pedidos} = cliente;

    pedidos.forEach(articulo =>{

        const {id,nombre,precio,cantidad} = articulo;

        const itemLista = document.createElement('LI');
        itemLista.classList.add('list-group-item');

        const nombreLi = document.createElement('H4');
        nombreLi.classList.add('my-4');
        nombreLi.textContent = nombre;

        const cantidadLi = document.createElement('P');
        cantidadLi.classList.add('fw-bold');
        cantidadLi.textContent = 'Cantidad: ';

        const cantidadSpan = document.createElement('SPAN');
        cantidadSpan.classList.add('fw-normal');
        cantidadSpan.textContent = `${cantidad}`;

        const precioLi = document.createElement('P');
        precioLi.classList.add('fw-bold');
        precioLi.textContent = 'Precio: ';

        const precioSpan = document.createElement('SPAN');
        precioSpan.classList.add('fw-normal');
        precioSpan.textContent = `$${precio}`;

        const subTotalLi = document.createElement('P');
        subTotalLi.classList.add('fw-bold');
        subTotalLi.textContent = 'Subtotal: ';

        const subTotalSpan = document.createElement('SPAN');
        subTotalSpan.classList.add('fw-normal');
        subTotalSpan.textContent = `$${cantidad * precio}`;

        const buttonEliminar = document.createElement('BUTTON');
        buttonEliminar.classList.add('btn','btn-danger');
        buttonEliminar.textContent = 'Eliminar del Pedido';
        buttonEliminar.onclick = function (){

            eliminarPedido(id);

        }

        itemLista.appendChild(nombreLi);

        cantidadLi.appendChild(cantidadSpan);
        itemLista.appendChild(cantidadLi);

        precioLi.appendChild(precioSpan);
        itemLista.appendChild(precioLi);

        subTotalLi.appendChild(subTotalSpan);
        itemLista.appendChild(subTotalLi);

        itemLista.appendChild(buttonEliminar)

        listaGrupo.appendChild(itemLista);

    });

    resumen.appendChild(listaGrupo);
}

function eliminarPedido(id){

    const {pedidos} = cliente;
    const eliminandoProducto = pedidos.filter(platillo => platillo.id !== id);

    cliente.pedidos = [...eliminandoProducto];
    
    limpiarHTML();
    
    if(cliente.pedidos.length){

        actualizarResumen();

    }else{

        crearParrafo();

    }

    reseteandoCantidadComida(id);
}

function reseteandoCantidadComida(id){
    const idPlatilloEliminado = document.querySelector(`#producto-${id}`);
    idPlatilloEliminado.value = 0;
}

function crearParrafo(){
    const contenido = document.querySelector('#resumen .contenido');
    const parrafo = document.createElement('P');
    parrafo.textContent = 'Añade los elementos del pedido';
    parrafo.classList.add('text-center');

    contenido.appendChild(parrafo);
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}
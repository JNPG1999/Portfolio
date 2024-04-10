const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');
const selectCriptomonedas = document.querySelector('#criptomonedas');
const imagenesPorPagina = 30;
let totalPaginas;
let terminoBusqueda; 
let iterador;
let paginaActual = 1;

window.onload = () =>{

    formulario.addEventListener('submit',buscarImagen);

}

function buscarImagen(e){

    e.preventDefault();

    terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '' ){
        mostrarAlerta('Este campo debe ser completado');
        return;
    }

    obtenerImagenes();

    formulario.reset();
}


const promiseCriptomonedas = criptomonedas => new Promise (resolve => {

    resolve(criptomonedas);
    
});


async function obtenerImagenes(){

    const key = '24455765-286cd245b9af78451bcdb67e6';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas= await promiseCriptomonedas(resultado.Data);
    
            criptomonedas.forEach(cripto => {
                
                const {Name,FullName} = cripto.CoinInfo;
    
                const option = document.createElement('OPTION');
                option.value = Name;
                option.textContent = FullName;
    
                selectCriptomonedas.appendChild(option);
                    
            });
        
    } catch (error) {
        console.log(error);
       }
 
        
}

function *cantidadPaginas(total){
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function mostrarImagenes(imagenes){
    const resultado = document.querySelector('#resultado');

    limpiarHTML(resultado);

    imagenes.forEach(imagen => {

        const {likes,views,previewURL,largeImageURL} = imagen;

        resultado.innerHTML += `
                <div class='w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4'>
                    <div class='bg-white'>
                        <img class='w-full' src='${previewURL}'>
                        <div class='p-4'>

                            <p class='font-bold'>${likes}<span class='font-light'> Me gustas</span></p>
                            <p class='font-bold'>${views}<span class='font-light'> Vistas</span></p>

                            <a href='${largeImageURL}' target='_blank' 
                            class='block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1'>

                            Ver Imagen

                            </a>
                        </div>
                    </div>
                </div>
        `
    });

    crearPaginas();
    console.log('Mostrar Imagenes:',paginaActual);
}

function crearPaginas(){

    iterador = cantidadPaginas(totalPaginas);
    
    while (true){
        const {value,done} = iterador.next();
        
        if (done) return; 
        
        const paginaBoton = document.createElement('A');
        paginaBoton.href = '#';
        paginaBoton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-4','uppercase','rounded');
        paginaBoton.dataset.pagina = value;
        paginaBoton.textContent = value;
        
        paginaBoton.onclick = ()=>{
            paginaActual = value;
            console.log('pagina:', paginaActual);
            obtenerImagenes();
        }

        paginacion.appendChild(paginaBoton);
    }
}

function mostrarAlerta(mensaje){

    const resultado = document.querySelector('#resultado');

    const alertaDiv = document.createElement('P');
    alertaDiv.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');
    alertaDiv.innerHTML = `

        <strong class='font-bold'>Error!</strong>
        <span class='block sm:inline'>${mensaje}</span>
    
    `;
    resultado.appendChild(alertaDiv);

    setTimeout(() => {
        alertaDiv.remove();
    }, 3000);

}

function limpiarHTML(selector){

    while(selector.firstChild){

        selector.removeChild(selector.firstChild);

    }
}

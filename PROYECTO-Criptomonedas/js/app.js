const selectCriptomonedas = document.querySelector('#criptomonedas');
const selectMonedas = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objetoDatos = {

    moneda:'',
    criptomoneda:''

}

document.addEventListener('DOMContentLoaded',()=>{

    obtenerCriptomonedas();
    formulario.addEventListener('submit',submitFormulario);
    selectCriptomonedas.addEventListener('change',valor);
    selectMonedas.addEventListener('change',valor);
    formulario.reset();
});


function submitFormulario(e){
    e.preventDefault();

    const {moneda,criptomoneda} = objetoDatos;

    if(moneda==='' || criptomoneda===''){
        
        mostrarAlerta('Todos los campos son requeridos');
        return;
    }

    //Consultando la API con los resultado
    consultandoAPI();

}



function mostrarAlerta(mensaje){
    
    const alertaDiv = document.querySelector('.alerta');

    if (!alertaDiv){
        
        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta','error');
        alerta.textContent = mensaje;
    
        resultado.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

const promiseCriptomonedas = criptomonedas => new Promise (resolve => {

    resolve(criptomonedas);
    
});

function valor(e){
    objetoDatos[e.target.name] = e.target.value;
    
}

async function obtenerCriptomonedas(){

    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    const criptomonedas = await promiseCriptomonedas(resultado.Data);

        criptomonedas.forEach(cripto => {
            
            const {Name,FullName} = cripto.CoinInfo;

            const option = document.createElement('OPTION');
            option.value = Name;
            option.textContent = FullName;

            selectCriptomonedas.appendChild(option);
                
        });
    
}

async function consultandoAPI(){
    const {moneda,criptomoneda} = objetoDatos;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    spinner();

    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda]);

}

function mostrarCotizacion(cotizacion){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //console.log(cotizacion);
    const {PRICE,CHANGEPCT24HOUR,HIGHDAY,LOWDAY,LASTUPDATE} = cotizacion;

    const price = document.createElement('P');
    price.classList.add('price');
    price.innerHTML = `
            El precio es: <span>${PRICE}</span>
    `;

    const precioAlto = document.createElement('P');
    //precioAlto.classList.add('');
    precioAlto.innerHTML = `
            El precio mas alto del dia <span>${HIGHDAY}</span>
    `;

    const precio24horas = document.createElement('P');
    precio24horas.classList.add('price');
    precio24horas.innerHTML = `
            El precio en las ultimas 24 horas: <span>${PRICE}</span>
    `;

    resultado.appendChild(price);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precio24horas);

}

function spinner(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    const spinnerDiv = document.createElement('DIV');
    spinnerDiv.classList.add('spinner');
    spinnerDiv.innerHTML=`
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    
    `

    resultado.appendChild(spinnerDiv);

    setTimeout(() => {
        spinnerDiv.remove();
    }, 3000);

    }



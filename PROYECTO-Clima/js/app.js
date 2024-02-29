const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load',()=>{//Esta linea de codigo es similar a DOMDocument pero esta inicia desde window

    formulario.addEventListener('submit',buscarClima);

});


function buscarClima(e){
    e.preventDefault();

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if( ciudad === '' || pais === '' ){
        mostrarAlerta('Todos los campos son Obligatorios');
        return;
    }

    consultarAPI(ciudad,pais);
}

function mostrarAlerta(mensaje){

    const alerta = document.querySelector('.alerta');
    
    if(!alerta){
        
        const divAlerta = document.createElement('DIV');

        divAlerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center','alerta');
    
        divAlerta.innerHTML = `
        <strong class='font-bold'>Error!</strong>
        <span class='block'>${mensaje}</span>
        `;
    
        container.appendChild(divAlerta);
    
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);

    }


}

function consultarAPI(ciudad,pais){

    const keyApi = '0d3bd688a4e1e41311883d068beb48ce';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${keyApi}`

    Spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos =>{
            
            limpiarHTML();

            if(datos.cod === '404'){

                mostrarAlerta('Ciudad no encontrada');
                return;
            }

            climaHTML(datos);

        });
    
}

function climaHTML(datos){

    const {name,main:{temp,temp_max,temp_min}} = datos;

    const centigrados = kelvinCentigrados(temp);
    const max = kelvinCentigrados(temp_max);
    const min = kelvinCentigrados(temp_min); 

    const ciudad = document.createElement('P');
    ciudad.textContent = `Clima en ${name}`;
    ciudad.classList.add('font-bold','text-2xl');

    const actual = document.createElement('P');
    actual.innerHTML = `${centigrados} &#8451; `;
    actual.classList.add('font-bold','text-6xl');

    const maximaTemp = document.createElement('P');
    maximaTemp.innerHTML = `Max: ${max} &#8451; `;
    maximaTemp.classList.add('text-xl');

    const minimaTemp = document.createElement('P');
    minimaTemp.innerHTML = `Min: ${min} &#8451; `;
    minimaTemp.classList.add('text-xl');

    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center','text-white');

    resultadoDiv.appendChild(ciudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(maximaTemp);
    resultadoDiv.appendChild(minimaTemp);

    resultado.appendChild(resultadoDiv);
    
}

const kelvinCentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

}

function Spinner(){

    limpiarHTML();

    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
        `;

    resultado.appendChild(divSpinner);
}

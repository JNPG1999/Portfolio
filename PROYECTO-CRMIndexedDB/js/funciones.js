let DB;

function conexionDB(){

    const conexionDB = window.indexedDB.open('crmClientes',1);

    conexionDB.onerror = function(){

        console.log('Conexion Fallo');

    };

    conexionDB.onsuccess = function(){

        console.log('Conexion Exitosa');
        DB = conexionDB.result;

    };

}

function mostrarAlerta(mensaje,tipo){

    const divAlerta = document.createElement('DIV');
    divAlerta.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','alerta');

    const alerta = document.querySelector('.alerta');

    if(!alerta){

        if (tipo === 'error'){
            divAlerta.classList.add('bg-red-100','border-red-400','text-red-700');
        }else{
            divAlerta.classList.add('bg-green-100','border-green-400','text-green-700');
        }

        divAlerta.textContent = mensaje;

        formulario.appendChild(divAlerta);

        setTimeout(()=>{
            divAlerta.remove();
        },3000);

    }

}


function iniciarApp(){

    const resultado = document.querySelector('#resultado');
    const selectCategorias = document.querySelector('#categorias');
    const modal = new bootstrap.Modal('#modal',{});
    let recetaFavorita;

    if (selectCategorias){

        selectCategorias.addEventListener('change',obtenerRecetas);
        obtenerCategoria();

    }

    const favoritosPag = document.querySelector('.favoritos');

    if(favoritosPag){
        obtenerFavorito();
    }

    function obtenerCategoria(){

        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.categories));

    }

    function mostrarCategorias(categorias){

        categorias.forEach(categoria =>{

            const {strCategory} = categoria;

            const option = document.createElement('OPTION');

            option.value = strCategory;
            option.textContent = strCategory;

            selectCategorias.appendChild(option);

        });

    }

    function obtenerRecetas(e){

        const categoria = e.target.value;

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetas(resultado.meals));

    }

    function mostrarRecetas(recetas = []){

        limpiarHTML(resultado);

        const header = document.createElement('H2');
        header.classList.add('text-center','text-black','my-5');
        header.textContent = recetas.length ? 'Resultados' :'No hay Resultados';

        resultado.appendChild(header);

        recetas.forEach(receta => {

            const {strMeal,strMealThumb,idMeal} = receta;

            const cardContenedor = document.createElement('DIV');
            cardContenedor.classList.add('col-md-4');

            const card = document.createElement('DIV');
            card.classList.add('card','mb-4');

            const imagen = document.createElement('IMG');
            imagen.alt = `Imagen de la receta ${strMeal}`;
            imagen.src = strMealThumb ?? receta.imagen;
            imagen.classList.add('card-img-top');

            const cardBody = document.createElement('DIV');
            cardBody.classList.add('card-body');

            const cardTitulo = document.createElement('H3');
            cardTitulo.classList.add('card-title','mb-3');
            cardTitulo.textContent = strMeal ?? receta.titulo;

            const cardButton = document.createElement('BUTTON');
            cardButton.textContent = 'Ver receta';
            cardButton.classList.add('btn','btn-danger','w-100');

            cardButton.onclick = function (e){
                seleccionarReceta(idMeal ?? receta.id);
                recetaFavorita = e.target.parentElement.parentElement.parentElement ;
            }

            cardBody.appendChild(cardTitulo);
            cardBody.appendChild(cardButton);

            card.appendChild(imagen);
            card.appendChild(cardBody);

            cardContenedor.appendChild(card);
            resultado.appendChild(cardContenedor);
        })

    }

    function seleccionarReceta(id){

        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.meals[0]));
    }

    function mostrarRecetaModal(receta){
        
        const {strMeal,strInstructions,strMealThumb,idMeal} = receta;
        
        const modalHeader = document.querySelector('.modal .modal-title');
        modalHeader.textContent = strMeal;

        const modalBody = document.querySelector('.modal .modal-body');
        modalBody.innerHTML =`
            <img class='img-fluid' src='${strMealThumb}' alt='receta de ${strMeal}'>
            <h3 class='my-3'>Instrucciones</h3>
            <p>${strInstructions}<p>
            <h3 class='my-3'>Ingredientes y Cantidades</h3>
        `;
        
        const ulIngredientes = document.createElement('UL');
        ulIngredientes.classList.add('list-group');

        for (let i = 1; i <= 20; i++) {

            if(receta[`strIngredient${i}`]){

                const ingrediente = receta[`strIngredient${i}`];
                const cantidad =  receta[`strMeasure${i}`];

                const liIngrediente = document.createElement('LI');
                liIngrediente.textContent = `${ingrediente} - ${cantidad}`;
                liIngrediente.classList.add('list-group-item');

                ulIngredientes.appendChild(liIngrediente);

            }
            
        }

        modalBody.appendChild(ulIngredientes);

        const modalFooter = document.querySelector('.modal .modal-footer');

        limpiarHTML(modalFooter);
        
        const guardarReceta = document.createElement('BUTTON');
        guardarReceta.classList.add('btn','btn-danger','col');
        guardarReceta.textContent = existeReceta(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';
        guardarReceta.onclick = function (){

            if(existeReceta(idMeal)){
                
                eliminarFavorito(idMeal);
                guardarReceta.textContent = 'Guardar Favorito';
                //
                if(favoritosPag){
                    recetaFavorita.remove();
                    modal.hide();
                }
                return;
            }

            guardarFavorito({
                id:idMeal,
                titulo:strMeal,
                imagen:strMealThumb
            });

            guardarReceta.textContent = 'Eliminar Favorito';

        };

        const cerrarReceta = document.createElement('BUTTON');
        cerrarReceta.classList.add('btn','btn-secondary','col');
        cerrarReceta.onclick = function (){
            modal.hide();
        };

        cerrarReceta.textContent = 'Cerrar';

        modalFooter.appendChild(guardarReceta);
        modalFooter.appendChild(cerrarReceta);

        modal.show();
    }

    function guardarFavorito(receta){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        
        localStorage.setItem('favoritos',JSON.stringify([...favoritos,receta]))

    }

    function existeReceta(id){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        return favoritos.some(favorito => favorito.id === id);

    }

    function eliminarFavorito(id){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);

        localStorage.setItem('favoritos',JSON.stringify(nuevosFavoritos));

    }

    function obtenerFavorito(){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        if(favoritos.length){
            mostrarRecetas(favoritos);
            return;
        }

        const noFavoritos = document.createElement('P') ;
        noFavoritos.textContent = 'No hay favoritos aún';
        noFavoritos.classList.add('text-center','font-bold','fs-4','mt-5')

        resultado.appendChild(noFavoritos);

    }

    function limpiarHTML(selector){
        while (selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }

    //selectCategorias.addEventListener('change',obtenerRecetas);

}

document.addEventListener('DOMContentLoaded',iniciarApp);
function iniciarApp(){

    const selectCategorias = document.querySelector('#categorias');
    const resultado = document.querySelector('#resultado');
    const modal = new bootstrap.Modal('#modal',{});

    if (selectCategorias){
        selectCategorias.addEventListener('change',seleccionarCategoria);
        obtenerCategorias();
    }

    const favoritosDiv = document.querySelector('.favoritos');

    if (favoritosDiv){
        obtenerFavoritos();
    }

    function obtenerCategorias(){

        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.categories));
    }

    function mostrarCategorias(categorias = []){

        categorias.forEach(categoria => {
            
            const {strCategory} = categoria;

            const option = document.createElement('OPTION');

            option.value = strCategory;
            option.textContent =  strCategory;

            selectCategorias.appendChild(option);

        });
    }

    function seleccionarCategoria(e){

        const categoria = e.target.value;

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetas(resultado.meals));

    }

    function mostrarRecetas(recetas = []){
        
        limpiarHTML(resultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center','text-black','my-5');
        heading.textContent = recetas.length ? 'Resultados' : 'No hay resultados';

        resultado.appendChild(heading);

        recetas.forEach(receta => {

            const {strMeal,strMealThumb,idMeal} = receta;
            
            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col-md-4');
            
            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card','mb-4');

            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb ?? receta.img;

            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title','mb-3');
            recetaHeading.textContent = strMeal ?? receta.titulo;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn','btn-danger','w-100');
            recetaButton.textContent = 'Ver receta';
            /*
            recetaButton.dataset.bsTarget = '#modal';
            recetaButton.dataset.bsToggle ='modal';*/
            recetaButton.onclick = function (){

                seleccionarReceta(idMeal ?? receta.id)

            }

            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);
            
            resultado.appendChild(recetaContenedor);

        })
    }

    function seleccionarReceta(id){

        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.meals[0]));

    }

    function mostrarRecetaModal(receta){
        
        const {strMeal,strMealThumb,strInstructions,idMeal} = receta;
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');
        
        modalTitle.textContent = strMeal;

        modalBody.innerHTML = `
                    <img class='img-fluid' src='${strMealThumb}' alt='receta ${strMeal}'>
                    <h3 class='my-3'>Instrucciones</h3>
                    <p>${strInstructions}</p>
                    <h3 class='my-3'>Cantidades e Ingredientes</h3>
        `

        const listaIngredientes = document.createElement('UL');
        listaIngredientes.classList.add('list-group');


        for (let i = 1; i <= 20; i++) {
            
            if(receta[`strIngredient${i}`]){

                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const unidadIngrediente = document.createElement('LI');
                unidadIngrediente.classList.add('list-group-item');
                unidadIngrediente.textContent = `${ingrediente} - ${cantidad}`;

                listaIngredientes.appendChild(unidadIngrediente);

            };

        }
        
        modalBody.appendChild(listaIngredientes);

        const modalFooter = document.querySelector('.modal .modal-footer');

        limpiarHTML(modalFooter);

        //Botones cerrar y favorito
        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('btn','btn-danger','col');
        btnFavorito.textContent = verificarDuplicado(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';
        btnFavorito.onclick = function (){

            if(verificarDuplicado(idMeal)){
                eliminarFavorito(idMeal);
                btnFavorito.textContent = 'Guardar Favorito';
                mostrarToast('Eliminado correctamente');
                return;
            }

            agregarFavorito({
                id: idMeal,
                titulo: strMeal,
                img: strMealThumb,
            });

            btnFavorito.textContent = 'Eliminar Favorito';
        }

        const btncerrar = document.createElement('BUTTON');
        btncerrar.classList.add('btn','btn-secondary','col');
        btncerrar.textContent ='Cerrar';
        btncerrar.onclick = function(){
            modal.hide();
        }

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btncerrar);

        modal.show();
    }

    function mostrarToast(mensaje){

        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show();

    }

    function eliminarFavorito(id){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevoFavorito = favoritos.filter(favorito => favorito.id !== id);

        localStorage.setItem('favoritos',JSON.stringify([nuevoFavorito]));

    }

    function agregarFavorito(receta){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        
        localStorage.setItem('favoritos',JSON.stringify([...favoritos,receta]));

    }

    function verificarDuplicado(id){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        return favoritos.some(favorito => favorito.id === id);

    }

    function obtenerFavoritos(){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        if (favoritos.length){
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

}

//document.addEventListener('DOMContentLoaded',iniciarApp);

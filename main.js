// Selección de elementos principales del DOM
const containerCards = document.querySelector(".container"); // Contenedor de tarjetas
const btnCargar = document.querySelector("#btn-cargar"); // Botón "Cargar más"
const buscador = document.querySelector("#buscador"); // Input de búsqueda

// Variables para manejo de personajes y paginación
let personajesTotales = []; // Lista completa de personajes (cargada al inicio)
let personajesMostrados = []; // Lista de personajes que se muestran actualmente
let paginaActual = 1; // Número de página actual
const limit = 10; // Cantidad de personajes por página

// Función que genera las tarjetas a partir de los datos de los personajes
const nodosCards = (data, container) => {
    // Generamos el HTML de las tarjetas usando el método reduce
    const nodos = data.reduce((acc, element) => {
        return acc + `
        <div class="cards">
            <article class="card p-3 shadow">
                <div class="header d-flex justify-content-between align-items-center">
                    <p class="race">${element.race || "Desconocida"}</p>
                    <img src="./img/esfera.png" alt="Dragon Ball" class="dragon-ball" width="30">
                </div>
                <figure class="containerImg text-center">
                    <img src="${element.image}" alt="${element.name}" class="character-img img-fluid">
                </figure>
                <h3 class="name text-center my-2">${element.name}</h3>
                <div class="description "  overflow: hidden;">
                    <p>${element.description || "Sin descripción disponible."}</p>
                </div>
            </article>
        </div>
        `;
    }, "");

    // Actualizamos el contenedor con las nuevas tarjetas
    container.innerHTML = nodos;
};

// Función para cargar todos los personajes desde la API
const cargarTodosLosPersonajes = async () => {
    try {
        let pagina = 1; // Empezamos en la página 1
        const personajes = [];

        // Llamamos a la API hasta que no haya más personajes
        while (true) {
            const nuevosPersonajes = await llamadoApi(pagina, limit);
            if (nuevosPersonajes.length === 0) break; // Si no hay más personajes, salimos del loop
            personajes.push(...nuevosPersonajes); // Añadimos los personajes a la lista
            pagina++; // Incrementamos el número de página
        }

        return personajes;
    } catch (error) {
        console.error("Error al cargar todos los personajes:", error);
        return [];
    }
};

// Función para cargar más personajes en pantalla (paginación)
btnCargar.addEventListener("click", () => {
    const startIndex = paginaActual * limit; // Índice inicial de la página actual
    const endIndex = startIndex + limit; // Índice final de la página actual
    const nuevosPersonajes = personajesTotales.slice(startIndex, endIndex); // Segmento de personajes a mostrar

    personajesMostrados.push(...nuevosPersonajes); // Añadimos los nuevos personajes a la lista mostrada
    nodosCards(personajesMostrados, containerCards); // Actualizamos las tarjetas en pantalla
    paginaActual++; // Incrementamos el número de página
});

// Función para buscar personajes en todos los datos
buscador.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase(); // Convertimos el texto ingresado a minúsculas
    const personajesFiltrados = personajesTotales.filter((personaje) =>
        personaje.name.toLowerCase().includes(termino)
    ); // Filtramos por nombre

    nodosCards(personajesFiltrados, containerCards); // Actualizamos las tarjetas con los resultados
});

// Función para obtener datos de la API
const llamadoApi = (pagina, limit) => {
    const url = `https://dragonball-api.com/api/characters?page=${pagina}&limit=${limit}`;
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.items)
        .catch((error) => console.error("Error al cargar los datos:", error));
};

// Inicialización: cargar todos los personajes al inicio
(async () => {
    try {
        personajesTotales = await cargarTodosLosPersonajes(); // Obtenemos todos los personajes
        personajesMostrados = personajesTotales.slice(0, limit); // Mostramos solo los primeros
        nodosCards(personajesMostrados, containerCards); // Mostramos las tarjetas iniciales
    } catch (error) {
        console.error("Error al cargar los personajes iniciales:", error);
    }
})();

const containerCards = document.querySelector(".container");
const btnCargar = document.querySelector("#btn-cargar")

const nodosCards = (data, container) => {
    const nodos = data.reduce((acc, element) => {
        return acc + `
        <article class="card">
            <div class="header">
            <p class="race"> ${element.race || "Desconocida"}</p>
            <img src="./img/esfera.png" 
            alt="Dragon Ball" class="dragon-ball">
            </div>
            <figure class="containerImg">
            <img src="${element.image}" alt="${element.name}" class="character-img">
            </figure>
            <h3 class="name">${element.name}</h3>
            <div class="description">
                <p>${element.description || "Sin descripción disponible."}</p>
            </div>
        </article>
        `;
    }, "");

    // agrego+= para que los nuevos personajes que se carguen no sustituyan a los ya presentes
    container.innerHTML += nodos;
};

let paginaActual = 1
const limit = 10; //pj por pagina

// function cargarMas(e) {
//     e.adde
// }

btnCargar.addEventListener("click", async () => {
    try {
        paginaActual++; //incrementa el numero de pagina de a 1
        const nuevosPersonajes = await llamadoApi(paginaActual, limit); //obtiene los nuevos personajes
        nodosCards(nuevosPersonajes, containerCards) //agrega las cards al contenedor

    } catch (error) {
        console.error("Error al cargar los personajes", error)

    }
})

// llamado api ahora tiene dos parametros, los cuales son la pagina y el limite
// ya que en la doc de dbAPI asi se manejan el paginado
const llamadoApi = (pagina, limit) => {
    const url = `https://dragonball-api.com/api/characters?page=${pagina}&limit=${limit}`
    console.log("URL solicitada:", url);
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.items)
        .catch((error) => console.error("Error al cargar los datos:", error));
};

// llamadoApi("https://dragonball-api.com/api/characters", nodosCards);

//cargar la primera pagina al inicio
(async () => {
    try {
        console.log("cargando principales");
        const personajesIniciales = await llamadoApi(paginaActual, limit);
        console.log(personajesIniciales);

        nodosCards(personajesIniciales, containerCards)
    } catch (error) {
        console.error("Error al cargar los personajes iniciales", error)
    }
}
)();


const containerCards = document.querySelector(".container");
const cargarMas = document.querySelector("#btn-cargar")

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
    container.innerHTML += nodos;
};

let paginaActual = 1
const limit = 10; //pj por pagina

// function cargarMas(e) {
//     e.adde
// }

const llamadoApi = (url, generarNodos) => {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            const personajes = data.items;
            generarNodos(personajes, containerCards);
        })
        .catch((error) => console.error("Error al cargar los datos:", error));
};

llamadoApi("https://dragonball-api.com/api/characters", nodosCards);

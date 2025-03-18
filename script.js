// Elementos del DOM
const pokemonImg = document.getElementById("pokemon_img");
const searchPokemonBtn = document.getElementById("search_pokemon_btn");
const inputPokemon = document.getElementById("input_pokemon");
const typeContainer = document.getElementById("pokemon_types"); // Contenedor de los tipos

// URLs de la API
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";


// Función para obtener datos de la API de PokeAPI
async function fetchData(input) {
    try {
        const response = await fetch(apiUrl + input.toLowerCase());
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Función para cargar el SVG del tipo de Pokémon
// Función para cargar el SVG del tipo de Pokémon
async function loadTypeSVG(container, typeName) {
    try {
        const response = await fetch(
            `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${typeName}.svg`
        );
        const svgText = await response.text();

        // Parsear el SVG como un documento XML
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        // Obtener el elemento <path> del SVG
        const pathElement = svgDoc.querySelector("path");

        if (pathElement) {
            // Clonar el elemento <path> y agregarlo al contenedor
            container.innerHTML = ""; // Limpiar el contenedor
            container.setAttribute("d", pathElement.getAttribute("d")); // Agregar el nuevo <path>
        } else {
            console.error("No se encontró un elemento <path> en el SVG.");
        }
    } catch (error) {
        console.error("Error cargando el SVG:", error);
        container.innerHTML = ""; // Limpiar el contenedor en caso de error
    }
}

// Función para buscar un Pokémon
async function searchPokemon() {
    const input = inputPokemon.value.trim();

    if (!input) return alert("Por favor, ingresa un nombre o número de Pokémon.");

    const data = await fetchData(input);
    if (!data) {
        alert("There's any pokemon with that id")
        return;
    }

    // Restaurar el contenedor de tipos
    typeContainer.innerHTML = `
        <svg class="pokemon_type" id="pokemon_type_1" xmlns="http://www.w3.org/2000/svg" width="512"
                        height="512" viewBox="0 0 512 512" fill="none">
                        <path id="type_1_svg"/>
                            </svg>
                    <svg class="pokemon_type" id="pokemon_type_2" xmlns="http://www.w3.org/2000/svg" width="512"
                        height="512" viewBox="0 0 512 512" fill="none">
                        <path id="type_2_svg"/>
                    
    `;
    const pokemonTypes = [document.getElementById("type_1_svg"), document.getElementById("type_2_svg")];



    // Actualizar la imagen del Pokémon
    pokemonImg.src = data.sprites.other["official-artwork"].front_default;
    pokemonImg.alt = `Imagen de ${data.name}`;

    // Actualizar los tipos del Pokémon
    let i = 0;
    for (const type of data.types) {
        const typeName = type.type.name;
        const container = i === 0 ? pokemonTypes[0] : pokemonTypes[1];
        await loadTypeSVG(container, typeName); // Esperar a que termine loadTypeSVG
        i++;
    }

    if (i < 2) {
        document.getElementById("pokemon_type_2").setAttribute("display", "none");
    } else {
        document.getElementById("pokemon_type_2").removeAttribute("display");
    }


    console.log("Datos del Pokémon:", data);
}
// Asignar la función al botón de búsqueda
searchPokemonBtn.onclick = searchPokemon;
inputPokemon.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchPokemon();
    }
});


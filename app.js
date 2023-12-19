const pokemonsURL = 'https://cors-anywhere-production-51be.up.railway.app/https://storage.googleapis.com/campus-cvs/00000000000-images-lectures/pokemons.json';

class Pokemon {
    constructor(img, id, name, type, abilities, height, weight, weaknesses) {
        this.img = img,
            this.id = id,
            this.name = name,
            this.type = type,
            this.abilities = abilities,
            this.height = height,
            this.weight = weight,
            this.weaknesses = weaknesses
    }
}

// Variables
const cardsContainer = document.querySelector('.cards-container');
const modalBackground = document.querySelector('.modal-background');
const pokemonDetails = document.querySelector('.pokemon-details');
const searchForm = document.querySelector('.search-form');
const searchInput = document.getElementById('search-pokemon');
const closeDetailsBtn = document.querySelector('.close-details');
const suggestionToClick = document.querySelector('.suggestion-to-click');
let pokemonInstancesArray = null;

// Functions
const fetchAllPokemonsData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok:', response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createPokemonInstances = (allData) => {
    const allInstances = [];
    allData.forEach(pokemon => {
        if (!allInstances.some(pok => pok.name === pokemon.name)) {
            const img = pokemon.ThumbnailImage;
            const id = pokemon.id;
            const name = pokemon.name;
            const type = pokemon.type.join(', ');
            const abilities = pokemon.abilities.join(', ');
            const height = pokemon.height;
            const weight = pokemon.weight;
            const weakness = pokemon.weakness.join(', ');
            const newPokemon = new Pokemon(img, id, name, type, abilities, height, weight, weakness);
            allInstances.push(newPokemon);
        }
    })
    return allInstances;
}

const displayPokemons = (array) => {
    array.forEach(obj => {
        const newElement = document.createElement('div');
        newElement.classList.add('poke-card-container');
        newElement.innerHTML = `<div class="card my-3 my-lg-4">
        <img class="card-img-top"
            src=${obj.img}>
        <div class="poke-body card-body d-flex flex-column align-items-center justify-content-between">
            <div>
            <p class="card-title fw-medium text-center fs-4">${obj.name}</p>
            <p class="card-text fw-medium text-center fs-4">Type(s): <span>${obj.type}</span></p>
            </div>
            <button class="btn-details btn btn-primary" id=${obj.id}>More details</button>
        </div>
    </div>`
        cardsContainer.append(newElement);
    })
}

const displayPokemonDetails = (array, id) => {
    const pokeObj = array.find(obj => obj.id == id);    
    pokemonDetails.innerHTML = `<div class="my-4 d-flex flex-column align-items-center">
    <img class="details-img" src=${pokeObj.img}>
    <p class="fs-1 fw-bold">${pokeObj.name}</p>
    <div class="modal-data row px-lg-5">
        <div class="col fw-bold text-primary">
            <p>Type(s):</p>
            <p>Weight:</p>
            <p>Height:</p>
            <p>Abilities:</p>
            <p>Weaknesses:</p>
        </div>
        <div class="col">
            <p>${pokeObj.type}</p>
            <p>${pokeObj.weight} lbs</p>
            <p>${pokeObj.height}"</p>
            <p>${pokeObj.abilities}</p>
            <p>${pokeObj.weaknesses}</p>
        </div>
    </div>
</div>`
    modalBackground.classList.remove('d-none');
}

const displaySearchedPokemon = (array, value) => {
    const valueLowerCase = value.toLowerCase();
    const pokName = valueLowerCase.charAt(0).toUpperCase() + valueLowerCase.slice(1);
    const pokObj = array.find(obj => obj.name === pokName);
    if (pokObj) {
        cardsContainer.innerHTML = `<div class="card my-3 my-lg-4">
        <img class="card-img-top"
            src=${pokObj.img}>
            <div class="poke-body card-body d-flex flex-column align-items-center justify-content-between">
            <div>
            <p class="card-title fw-medium text-center fs-4">${pokObj.name}</p>
            <p class="card-text fw-medium text-center fs-4">Type(s): <span>${pokObj.type}</span></p>
            </div>
            <button class="btn-details btn btn-primary" id=${pokObj.id}>More details</button>
        </div>
    </div>`
    }
    suggestionToClick.classList.remove('d-none');
}

const fetchCreateAndDisplayPokemons = async () => {
    try {
        const fullData = await fetchAllPokemonsData(pokemonsURL);
        pokemonInstancesArray = createPokemonInstances(fullData);
        displayPokemons(pokemonInstancesArray);
    } catch(error) {
        console.error(error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchCreateAndDisplayPokemons();
})

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    displaySearchedPokemon(pokemonInstancesArray, searchInput.value);
});

cardsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-details')) {
        displayPokemonDetails(pokemonInstancesArray, e.target.id);
    }
});

closeDetailsBtn.addEventListener('click', () => {
    modalBackground.classList.add('d-none');
});
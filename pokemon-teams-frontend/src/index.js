const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener(`DOMContentLoaded`, e => {
    const main = document.querySelector(`main`)
    
    document.addEventListener(`click`, e => {
        
        if (e.target.matches(`.add-pokemon-btn`)) {
            const targetTrainerCard = e.target.parentNode
            const targetPokemonList = targetTrainerCard.querySelector(`ul`)

            if (targetTrainerCard.dataset.pokemonQty < 6) {
                fetch(POKEMONS_URL, {
                    method: `POST`,
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({trainer_id: targetTrainerCard.dataset.trainerId})
                })
                .then(r => r.json())
                .then(pokemon => {
                    const pokemonLi = document.createElement(`li`)
                    pokemonLi.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release">Release</button>`
                    pokemonLi.dataset.id = pokemon.id
                    targetPokemonList.append(pokemonLi)
                    targetTrainerCard.dataset.pokemonQty++
                })
            } 
        } else if (e.target.matches(`.release`)) {
            const targetPokemonLi = e.target.parentNode
            const targetTrainerCard = targetPokemonLi.parentNode.parentNode
            fetch(POKEMONS_URL + `/${targetPokemonLi.dataset.id}`, {
                method: `DELETE`
            })
            .then(() => {
                targetTrainerCard.dataset.pokemonQty -= 1
                targetPokemonLi.remove()
            })
        }
    })
    
    fetch(TRAINERS_URL)
        .then(resp => resp.json())
        .then(trainerData => {
            trainerData.forEach(trainer => {
                const trainerCardDiv = document.createElement(`div`)
                trainerCardDiv.classList.add(`card`)
                trainerCardDiv.dataset.pokemonQty = trainer.pokemons.length
                trainerCardDiv.dataset.trainerId = trainer.id
                trainerCardDiv.innerHTML = `
                    <p>${trainer.name}</p>
                    <button class="add-pokemon-btn">Add Pokemon</button>
                    <ul></ul>
                `
                const pokemonList = trainerCardDiv.querySelector(`ul`)
                trainer.pokemons.forEach(pokemon => {
                    const pokemonLi = document.createElement(`li`)
                    pokemonLi.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release">Release</button>`
                    pokemonLi.dataset.id = pokemon.id
                    pokemonList.append(pokemonLi) 
                })
                main.append(trainerCardDiv)
            })
        })
})
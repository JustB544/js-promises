const body = document.querySelector("body");
const button = document.querySelector("button");
const img = document.querySelector("img");

const nums = "2,3,5,7";
const fav_num = 72;

const num_api = "http://numbersapi.com";

let deck = "";


async function num_api_1(){
    const {data} = await axios.get(`${num_api}/${nums}?json`);
    for (let key in data){
        const el = document.createElement("span");
        el.innerText = key;
        body.appendChild(el);
        body.appendChild(document.createElement("br"));
    }
}

async function num_api_2(){
    const promises = [];
    for (let i = 0; i < 4; i++){
        promises.push(axios.get(`${num_api}/${fav_num}?json`));
    }
    const responses = await Promise.all(promises);
    responses.forEach((fact) => {
        const el = document.createElement("span");
        el.innerText = fact.data.text;
        body.appendChild(el);
        body.appendChild(document.createElement("br"));
    });
}

async function get_new_deck(){
    if (localStorage.getItem("deck") === null){
        const {data} = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle")
        localStorage.setItem("deck", data.deck_id);
    }
    else {
        deck = localStorage.getItem("deck");
        const {data} = await axios.get(`https://deckofcardsapi.com/api/deck/${deck}/shuffle`)
        if (data.success === false){
            localStorage.removeItem("deck");
            get_new_deck();
        }
    }
}

function cards_api(){
    get_new_deck();
    button.hidden = false;
    button.addEventListener("click", async () => {
        const {data} = await axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/`)
        img.src = data.cards["0"].image;
        if (data.remaining === 0){
            axios.get(`https://deckofcardsapi.com/api/deck/${deck}/shuffle`);
        }
    });
}

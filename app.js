const body = document.querySelector("body");
const button = document.querySelector("button");
const img = document.querySelector("img");

const nums = "2,3,5,7";
const fav_num = 72;

const num_api = "http://numbersapi.com";

let deck = "";


function num_api_1(){
    const promise = axios.get(`${num_api}/${nums}?json`)
    .then(({data}) => {
        for (let key in data){
            const el = document.createElement("span");
            el.innerText = key;
            body.appendChild(el);
            body.appendChild(document.createElement("br"));
        }
    })
    .catch(() => console.log("Error"));
}

function num_api_2(){
    const promises = [];
    for (let i = 0; i < 4; i++){
        promises.push(axios.get(`${num_api}/${fav_num}?json`));
    }
    Promise.all(promises)
    .then((data) => {
        data.forEach((fact) => {
            const el = document.createElement("span");
            el.innerText = fact.data.text;
            body.appendChild(el);
            body.appendChild(document.createElement("br"));
        });
    })
    .catch(() => console.log("Error"));
}

function get_new_deck(){
    if (localStorage.getItem("deck") === null){
        const deck = axios.get("https://deckofcardsapi.com/api/deck/new/shuffle")
        .then(({data}) => {
            console.log(data)
            localStorage.setItem("deck", data.deck_id);
        })
        .catch(() => console.log("Error"));
    }
    else {
        deck = localStorage.getItem("deck");
        axios.get(`https://deckofcardsapi.com/api/deck/${deck}/shuffle`)
        .catch(() => {
            localStorage.removeItem("deck");
            get_new_deck();
        });
    }
}

function cards_api(){
    get_new_deck();
    button.hidden = false;
    button.addEventListener("click", () => {
        const promise = axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/`)
        .then(({data}) => {
            console.log(data);
            img.src = data.cards["0"].image;
            console.log(data.remaining);
            if (data.remaining === 0){
                axios.get(`https://deckofcardsapi.com/api/deck/${deck}/shuffle`);
            }
        })
        .catch(() => console.log("Error"));
    });
}

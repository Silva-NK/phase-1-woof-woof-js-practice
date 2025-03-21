document.addEventListener("DOMContentLoaded", () => {
    getPups();
});

let allPups = [];
let filterOn = false;

const doggoInfo = document.getElementById("dog-info");
const doggoBar = document.getElementById("dog-bar");

function getPups() {
    fetch("http://localhost:3000/pups")
    .then(response=> response.json ())
    .then(pups=> {
        allPups = pups;
        console.log(pups);
        displayPups(pups);
    })
    .catch(error => console.error("Error fetching pups:", error));
}

function displayPups(pups) {
    doggoBar.innerHTML = "";

    pups.forEach(pup=> {
        const span = document.createElement("span");
        span.textContent = pup.name;
        span.addEventListener("click", () => showDoggoInfo(pup));
        doggoBar.appendChild(span);
    });
}

function showDoggoInfo(pup) {
    doggoInfo.innerHTML = "";

    const doggoImage = document.createElement("img");
    doggoImage.src = pup.image;

    const doggoName = document.createElement("h2");
    doggoName.textContent = pup.name;

    const doggoButton = document.createElement("button");
    doggoButton.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";


    doggoButton.addEventListener("click", () => {
        pup.isGoodDog = !pup.isGoodDog;
        doggoButton.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";

        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isGoodDog: pup.isGoodDog })
        }).then(response => response.json ())
        .then(updatedPup => console.log("Updated Pup: ", updatedPup))
        .catch(error => console.error("Error updating pup: ", error));
    });

    doggoInfo.appendChild(doggoImage);
    doggoInfo.appendChild(doggoName);
    doggoInfo.appendChild(doggoButton);
}

const filterButton = document.getElementById("good-dog-filter");
filterButton.addEventListener("click", () => {
    filterOn = !filterOn;
    filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
    filterPups();
});

function filterPups() {
    if (filterOn) {
        displayPups(allPups.filter (pup => pup.isGoodDog));
    }
    else {
        displayPups(allPups);
    }
}
const loadAllDrinks = () => {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
        .then(response => response.json())
        .then(data => {
            displayDrinks(data.drinks || []);
        })
        .catch(error => console.error("Error fetching drinks:", error));
};

document.addEventListener("DOMContentLoaded", () => {
    loadAllDrinks(); // Load default drinks

    document.getElementById("searchButton").addEventListener("click", () => {
        const searchTerm = document.getElementById("searchInput").value.trim();
        if (searchTerm) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    displayDrinks(data.drinks || []);
                })
                .catch(error => console.error("Error fetching drinks:", error));
        }
    });
});

function displayDrinks(drinks) {
    const container = document.getElementById("drinksContainer");
    container.innerHTML = ""; // Clear previous results

    if (drinks.length === 0) {
        container.innerHTML = "<p class='text-danger'>No drinks found.</p>";
        return;
    }

    drinks.slice(0, 8).forEach((drink) => {
        const drinkCard = document.createElement("div");
        drinkCard.className = "col-md-6 mb-4";
        drinkCard.innerHTML = `
            <div class="card">
                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}">
                <div class="card-body">
                    <h5 class="card-title">${drink.strDrink}</h5>
                    <p><strong>Category:</strong> ${drink.strCategory}</p>
                    <p>${drink.strInstructions.slice(0, 15)}...</p>
                    <button class="btn btn-success" onclick="addToGroup('${drink.strDrink}', '${drink.strDrinkThumb}')">Add to Group</button>
                    <button class="btn btn-info" onclick="showDetails('${drink.strDrink}', '${drink.strCategory}', '${drink.strGlass}', '${drink.strInstructions}', '${drink.strAlcoholic}')">Details</button>
                </div>
            </div>
        `;
        container.appendChild(drinkCard);
    });
}

// Selected drinks logic
let selectedDrinks = [];
function addToGroup(drinkName, drinkImage) {
    if (selectedDrinks.length >= 7) {
        alert("You can't add more than 7 drinks.");
        return;
    }

    selectedDrinks.push({ name: drinkName, image: drinkImage });
    updateSelectedDrinks();
}

function updateSelectedDrinks() {
    const list = document.getElementById("selectedDrinks");
    list.innerHTML = "";
    selectedDrinks.forEach((drink, index) => {
        const listItem = document.createElement("div");
        listItem.className = "cart-item";
        listItem.innerHTML = `
            <img src="${drink.image}" alt="${drink.name}">
            <span>${drink.name}</span>
            <button class="btn btn-danger btn-sm" onclick="removeDrink(${index})">X</button>
        `;
        list.appendChild(listItem);
    });
    document.getElementById("drinkCount").innerText = selectedDrinks.length;
}

function removeDrink(index) {
    selectedDrinks.splice(index, 1);
    updateSelectedDrinks();
}

// Show modal with drink details
function showDetails(name, category, glass, instructions, alcoholic) {
    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalBody").innerHTML = `
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Glass:</strong> ${glass}</p>
        <p><strong>Instructions:</strong> ${instructions}</p>
        <p><strong>Alcoholic:</strong> ${alcoholic}</p>
    `;
    const modal = new bootstrap.Modal(document.getElementById("drinkModal"));
    modal.show();
}

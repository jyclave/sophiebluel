
console.log("fichier script.js chargé ");

const divGallery = document.querySelector(".gallery");

function displayWorks() {
fetch("http://localhost:5678/api/works")
.then ((response) => {
	return response.json()})
.then ((works) => {
	for (const work of works)
	{
		const workElement = document.createElement("figure");
		workElement.innerText = work.name;

		if (divGallery) {
			divGallery.appendChild(workElement);
			console.log(work)
		}

	}
}



)
}

	//faire un fetch et boucler sur const work//


displayWorks();


const filtersElement = document.querySelector(".filters"); // Emplacement pour ajouter les boutons

function displayCategories() {
	// Vérifie si l'emplacement existe
	if (!filtersElement) return;

	// Ajouter le bouton "Tous" manuellement
	const button = document.createElement("button");
	button.innerText = "Tous";
	button.classList.add("category-button");
	filtersElement.appendChild(button);

	// Charger et afficher les catégories dynamiquement
	fetch("http://localhost:5678/api/categories")
		.then((response) => response.json())
		.then((categories) => {
			for (const category of categories) {
				const filterElement = document.createElement("button");
				filterElement.innerText = category.name;
				filterElement.classList.add("category-button");

				// Ajouter chaque bouton à l'élément parent
				filtersElement.appendChild(filterElement);
				console.log(category);
			}
		});
}

displayCategories();

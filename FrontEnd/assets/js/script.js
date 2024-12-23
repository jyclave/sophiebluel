function displayWorks() {
  console.log("fichier script.js chargé ");
  let divGallery = document.querySelector(".gallery");
  // suite du code à faire ici pour l instant
  console.log(fetch("http://localhost:5678/api/works"));
	//faire un fetch et boucler sur const work//
}

displayWorks();

const filtersElement = document.querySelector(".filters");// emplacement pour ajouter les buttons//

function displayCategories() {

	fetch("http://localhost:5678/api/categories")
	.then ((response) => {
	return response.json()})
	.then ((categories) => {
		for (const category of categories) //a chaque tour de boucle sur categories on stocke les informations dans une variable category//
		{
			const filterElement = document.createElement("button");
		filterElement.innerText = category.name;

		if (filtersElement) {
			filtersElement.appendChild(filterElement);
		console.log(category)		
		}
		}
		
	});
}
displayCategories();


















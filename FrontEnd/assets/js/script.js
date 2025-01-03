
console.log("fichier script.js chargé ");

const divGallery = document.querySelector(".gallery");
const divGalleryModal = document.querySelector(".gallery-modal");

function displayWorks() {
    fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((works) => {
            for (const work of works) {
                // Créez un élément figure
                const workElement = document.createElement("figure");
                workElement.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
                workElement.setAttribute('id', `work-item-${work.id}`);
                workElement.setAttribute('work-id', `${work.id}`);

                const workGalleryElement = document.createElement("figure")
                workGalleryElement.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
                workGalleryElement.setAttribute('id', `work-item-${work.id}`);
                workGalleryElement.setAttribute('work-id', `${work.id}`);
                // Ajoutez une image
                const imgElement = document.createElement("img");
                imgElement.src = work.imageUrl;
                imgElement.alt = work.title;

                const imgGalleryElement = document.createElement("img")
                imgGalleryElement.src = work.imageUrl;
                imgGalleryElement.alt = work.title;

                // Ajoutez un figcaption
                const captionElement = document.createElement("figcaption");
                captionElement.innerText = work.title;

                // Assemblez tout
                workElement.appendChild(imgElement);
                workElement.appendChild(captionElement);
                workGalleryElement.appendChild(imgGalleryElement);


                // Ajoutez la figure à la galerie
                if (divGallery) {
                    divGallery.appendChild(workElement);
                }
               

                if (divGalleryModal) {
                  divGalleryModal.appendChild(workGalleryElement);
                }

                console.log(work); // Pour débogage
            }
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des travaux :", error);
        });
}

displayWorks();


const filtersElement = document.querySelector(".filters"); // Emplacement pour ajouter les boutons

function displayCategories() {
	// Vérifie si l'emplacement existe
	if (!filtersElement) return;

	// Ajouter le bouton "Tous" manuellement
	const button = document.createElement("button");
	button.innerText = "Tous";
	button.classList.add("filter-active", "work-filter");
	button.setAttribute("data-filter", "all");
	filtersElement.appendChild(button);

	// Ajouter un gestionnaire d'événement pour le bouton "Tous"
	button.addEventListener("click", function (event) {
		event.preventDefault();
		// Gérer les classes actives
		document.querySelectorAll(".work-filter").forEach((workFilter) => {
			workFilter.classList.remove("filter-active");
		});
		event.target.classList.add("filter-active");

		// Afficher tous les éléments de la galerie
		document.querySelectorAll(".work-item").forEach((workItem) => {
			workItem.style.display = "block"; // Afficher tous les éléments
		});
	});

	// Charger et afficher les catégories dynamiquement
	fetch("http://localhost:5678/api/categories")
		.then((response) => response.json())
		.then((categories) => {
			categories.forEach((category) => {
				const filterElement = document.createElement("button");
				filterElement.innerText = category.name;
				filterElement.classList.add("work-filter");
				filterElement.setAttribute("data-filter", category.id);

				// Ajouter chaque bouton à l'élément parent
				filtersElement.appendChild(filterElement);

				// Ajouter un gestionnaire d'événement pour chaque catégorie
				filterElement.addEventListener("click", function (event) {
					event.preventDefault();
					// Gérer les classes actives
					document.querySelectorAll(".work-filter").forEach((workFilter) => {
						workFilter.classList.remove("filter-active");
					});
					event.target.classList.add("filter-active");

					// Filtrer les éléments de la galerie selon la catégorie
					let categoryId = filterElement.getAttribute("data-filter");
					document.querySelectorAll(".work-item").forEach((workItem) => {
						workItem.style.display = "none";
					});
					document.querySelectorAll(`.work-item.category-id-${categoryId}`).forEach((workItem) => {
						workItem.style.display = "block";
					});
				});//ajouter ces catégories aussi dans la deuxième moitié modal dans un select avec chaque catégorie dans un option//
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

displayCategories();




// Sélectionner l'élément "modifier"
const modifyButtons = document.querySelectorAll('#top-bar, #span-top-bar');
const modal = document.getElementById('modal1');
const closeModal = modal.querySelector('.close');

// Ajouter un écouteur d'événement pour détecter les clics
modifyButtons.forEach((modifyButton) => {
  modifyButton.addEventListener('click', () => {
   modal.classList.remove('hidden');
  });
});

    // Ajouter un écouteur d'événement pour fermer la modale
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
      console.log(closeModal)
  });
  
  
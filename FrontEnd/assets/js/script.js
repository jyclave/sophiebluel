
console.log("fichier script.js chargé ");

const divGallery = document.querySelector(".gallery");

function displayWorks() {
    fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((works) => {
            for (const work of works) {
                // Créez un élément figure
                const workElement = document.createElement("figure");
                workElement.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
                workElement.setAttribute('id', `work-item-${work.id}`);

                // Ajoutez une image
                const imgElement = document.createElement("img");
                imgElement.src = work.imageUrl;
                imgElement.alt = work.name;

                // Ajoutez un figcaption
                const captionElement = document.createElement("figcaption");
                captionElement.innerText = work.title;

                // Assemblez tout
                workElement.appendChild(imgElement);
                workElement.appendChild(captionElement);

                // Ajoutez la figure à la galerie
                if (divGallery) {
                    divGallery.appendChild(workElement);
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
	button.classList.add("category-button", "filter-active");
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
				filterElement.classList.add("category-button");
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
				});
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

displayCategories();

function updateLoginState() {
  const token = localStorage.getItem("token"); // Vérifie si un token est présent
  const loginItem = document.querySelector("li#login"); // Cible l'élément <li> avec l'id "login"
  const topBar = document.querySelector(".hidden"); // Cible l'élément de la top bar avec la classe correspondante

  if (token) {
    // Si un token est présent, changer en "Logout"
    loginItem.textContent = "Logout";

    // Afficher la top bar en retirant la classe .hidden
    if (topBar) {
      topBar.classList.remove("hidden");
    }

    // Ajouter un écouteur pour la déconnexion
    loginItem.addEventListener("click", () => {
      localStorage.removeItem("token"); // Supprime le token
      localStorage.removeItem("userId"); // Supprime l'userId
      alert("Vous êtes déconnecté.");
      location.reload(); // Recharge la page pour actualiser l'état
    });
  } else {
    // Si aucun token, s'assurer que le texte est "Login"
    loginItem.textContent = "Login";

    // Masquer la top bar en ajoutant la classe .hidden
    if (topBar) {
      topBar.classList.add("hidden");
    }

    // Ajouter un écouteur pour rediriger vers login.html
    loginItem.addEventListener("click", () => {
      location.href = "login.html"; // Redirige vers la page de connexion
    });
  }
}

// Appeler cette fonction dès que la page est chargée
document.addEventListener("DOMContentLoaded", updateLoginState);



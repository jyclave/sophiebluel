
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

                const iconElement = document.createElement("i");
                iconElement.classList.add("fa-solid", "fa-trash-can", "overlay-icon");

                // Assemblez tout
                workElement.appendChild(imgElement);
                workElement.appendChild(captionElement);
                workGalleryElement.appendChild(imgGalleryElement);
                workGalleryElement.appendChild(iconElement);


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
				});
        const optionElement = document.createElement("option");
        optionElement.setAttribute("choice-category", category.id);
        optionElement.innerText = category.name;
        document.querySelector("select.choice-category").appendChild(optionElement);
        console.log(optionElement);
      //ajouter ces catégories aussi dans la deuxième moitié modal dans un select avec chaque catégorie dans un option//
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

displayCategories();

const modifyButtons = document.querySelectorAll('#top-bar, #span-top-bar');
const modal = document.getElementById('modal1');
const closeModalButtons = modal.querySelectorAll('.close');
const addPhotoButton = modal.querySelector('.add-photo');
const modalContent = modal.querySelector('.modal-content');
const modalContentAddPhoto = modal.querySelector('.modal-content-add-photo');
const arrowModalButton = modal.querySelector('.left-arrow');
// Ouvrir la modale principale
modifyButtons.forEach((modifyButton) => {
  modifyButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modalContent.style.display = 'block'; // Affiche la section principale
    modalContentAddPhoto.style.display = 'none'; // Masque la section d'ajout
  });
});

// Ouvrir la section "modal-content-add-photo" au clic sur "Ajouter une photo"
addPhotoButton.addEventListener('click', () => {
  modalContent.style.display = 'none'; // Masque la section principale
  modalContentAddPhoto.style.display = 'block'; // Affiche la section ajout
});

arrowModalButton?.addEventListener('click', () => {
	modalContent.style.display = 'block'; // Masque la section principale
  modalContentAddPhoto.style.display = 'none';
});


// Fermer la modale (tous les boutons close)
closeModalButtons.forEach((closeModal) => {
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
});

// Fermer la modale en cliquant à l'extérieur
window.addEventListener('click', (event) => {
  if (event.target === modal) { // Vérifie si l'utilisateur clique en dehors de la modale
    modal.classList.add('hidden');
  }
});

const fileInput = document.getElementById("form-image");
const MAX_FILE_SIZE = 4 * 1024 * 1024; // Taille maximale en octets (4 Mo)
const previewContainer = document.getElementById("modal-edit-new-photo");

// Réinitialisation de l'affichage
function resetPreview() {
    previewContainer.innerHTML = `
        <i id="photo-add-icon" class="fa-regular fa-image"></i>
        <label id="new-image">+ Ajouter photo</label>
        <input id="form-image" type="file" name="image" accept="image/*, .jpg, .jpeg, .png" required>
        <p id="photo-size">jpg, png : 4mo max</p>
    `;
    // Re-référencer l'input après sa réinitialisation
    const newFileInput = previewContainer.querySelector("input[type='file']");
    newFileInput.addEventListener("click", () => (newFileInput.value = ""));
    newFileInput.addEventListener("change", handleFileChange);
}

// Gérer le changement de fichier
function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            alert("Le fichier est trop volumineux. La taille maximale autorisée est de 4 Mo.");
            resetPreview(); // Réinitialiser si le fichier est invalide
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewContainer.innerHTML = ""; // Réinitialise l'affichage
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = file.name;
                img.style.maxWidth = "100%";
                img.style.maxHeight = "200px";

                const removeButton = document.createElement("button");
                removeButton.classList.add("delete-photo-button")
                removeButton.textContent = "Supprimer l'image";
                removeButton.style.display = "block";
                removeButton.style.marginTop = "10px";
                removeButton.addEventListener("click", resetPreview);

                previewContainer.appendChild(img);
                previewContainer.appendChild(removeButton);
            };
            reader.readAsDataURL(file);
        }
    }
}

// Ajout des événements au chargement initial
fileInput.addEventListener("click", () => (fileInput.value = ""));
fileInput.addEventListener("change", handleFileChange);






  
  
// Configuration
const API_URL = "http://localhost:5678/api";
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4Mo

// Éléments du DOM principaux
const divGallery = document.querySelector(".gallery");
const divGalleryModal = document.querySelector(".gallery-modal");
const filtersElement = document.querySelector(".filters");
const modal = document.getElementById('modal1');
const previewContainer = document.getElementById("modal-edit-new-photo");

// Fonction pour créer un élément de galerie
function createGalleryItem(work, isModal = false) {
    const figure = document.createElement("figure");
    figure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
    figure.setAttribute('id', isModal ? `work-item-modal-${work.id}` : `work-item-${work.id}`);
    figure.setAttribute('work-id', work.id);

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);

    if (!isModal) {
        const caption = document.createElement("figcaption");
        caption.innerText = work.title;
        figure.appendChild(caption);
    } else {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can", "overlay-icon");
        icon.addEventListener("click", () => deleteWork(work.id));
        figure.appendChild(icon);
    }

    return figure;
}

// Fonction d'affichage des travaux
function displayWorks() {
    fetch(`${API_URL}/works`)
        .then(response => response.json())
        .then(works => {
            works.forEach(work => {
                if (divGallery) {
                    divGallery.appendChild(createGalleryItem(work, false));
                }
                if (divGalleryModal) {
                    divGalleryModal.appendChild(createGalleryItem(work, true));
                }
            });
        })
        .catch(error => console.error("Erreur lors du chargement des travaux :", error));
}

// Fonction d'affichage des catégories
function displayCategories() {
    if (!filtersElement) return;

    // Création du bouton "Tous"
    createFilterButton();

    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                createFilterButton(category);
                addCategoryOption(category);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des catégories :", error));
}

// Fonction de suppression d'un travail
function deleteWork(workId) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token introuvable");
        return;
    }

    fetch(`${API_URL}/works/${workId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            if (response.ok) {
                document.querySelector(`#work-item-${workId}`)?.remove();
                document.querySelector(`#work-item-modal-${workId}`)?.remove();
                console.log(`Travail ${workId} supprimé avec succès.`);
            } else {
                console.error(`Erreur lors de la suppression du travail ${workId}.`);
            }
        })
        .catch(error => console.error("Erreur lors de la suppression :", error));
}

// Fonction de gestion des filtres
function createFilterButton(category = null) {
    const button = document.createElement("button");
    button.innerText = category ? category.name : "Tous";
    button.classList.add("work-filter");
    if (!category) button.classList.add("filter-active");
    button.setAttribute("data-filter", category ? category.id : "all");

    button.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelectorAll(".work-filter").forEach(filter => {
            filter.classList.remove("filter-active");
        });
        event.target.classList.add("filter-active");

        const filterId = category ? category.id : "all";
        filterGallery(filterId);
    });

    filtersElement.appendChild(button);
}

// Fonctions utilitaires
function filterGallery(categoryId) {
    document.querySelectorAll(".work-item").forEach(item => {
        if (categoryId === "all") {
            item.style.display = "block";
        } else {
            item.style.display = item.classList.contains(`category-id-${categoryId}`) ? "block" : "none";
        }
    });
}

function addCategoryOption(category) {
    const option = document.createElement("option");
    option.value = category.id;
    option.innerText = category.name;
    document.querySelector("select.choice-category")?.appendChild(option);
}

function resetPreview() {
    previewContainer.innerHTML = `
        <i id="photo-add-icon" class="fa-regular fa-image"></i>
        <label id="new-image">+ Ajouter photo</label>
        <input id="form-image" type="file" name="image" accept="image/*, .jpg, .jpeg, .png" required>
        <p id="photo-size">jpg, png : 4mo max</p>
    `;
    document.getElementById("form-title").value = "";
    document.getElementById("form-category").value = "";
    
    const newFileInput = previewContainer.querySelector("#form-image");
    newFileInput.addEventListener("change", handleGreyButton);
}

// Gestion de la modale
function initializeModal() {
    const modifyButtons = document.querySelectorAll('#top-bar, #span-top-bar');
    const closeModalButtons = modal.querySelectorAll('.close');
    const addPhotoButton = modal.querySelector('.add-photo');
    const modalContent = modal.querySelector('.modal-content');
    const modalContentAddPhoto = modal.querySelector('.modal-content-add-photo');
    const arrowModalButton = modal.querySelector('.left-arrow');

    // Gestionnaires d'événements de la modale
    modifyButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modalContent.style.display = 'block';
            modalContentAddPhoto.style.display = 'none';
        });
    });

    addPhotoButton.addEventListener('click', () => {
        modalContent.style.display = 'none';
        modalContentAddPhoto.style.display = 'block';
    });

    arrowModalButton?.addEventListener('click', () => {
        modalContent.style.display = 'block';
        modalContentAddPhoto.style.display = 'none';
        document.getElementById("submit-new-work").classList.remove("active");
        resetPreview();
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => modal.classList.add('hidden'));
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });

    initializeFormHandling();
}

function initializeFormHandling() {
    const form = document.getElementById("modal-edit-work-form");
    const submitButton = document.getElementById("submit-new-work");
    const inputs = ['form-title', 'form-category', 'form-image'].map(id => document.getElementById(id));

    inputs.forEach(input => {
        input.addEventListener("input", () => { 
            const isValid = inputs.every(input => 
                input.type === 'file' ? input.files.length > 0 : input.value.trim() !== ''
            );
            submitButton.classList.toggle("active", isValid);
            submitButton.disabled = !isValid;
        });
    });

    form?.addEventListener("submit", handleFormSubmit);
}

function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        alert("Le fichier est trop volumineux. La taille maximale autorisée est de 4 Mo.");
        resetPreview();
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewContainer.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = file.name;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "200px";

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "file";
        hiddenInput.id = "form-image";
        hiddenInput.name = "image";
        hiddenInput.style.display = "none";
        hiddenInput.files = event.target.files;

        previewContainer.appendChild(img);
        previewContainer.appendChild(hiddenInput);
    };
    reader.readAsDataURL(file);
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    const title = document.getElementById("form-title").value;
    const category = document.getElementById("form-category").value;
    const image = document.getElementById("form-image").files[0];
    const submitButton = document.getElementById("submit-new-work");

    if (!image) {
        alert("Veuillez sélectionner une image.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vous devez être connecté pour envoyer un projet.");
        return;
    }

    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
        const response = await fetch(`${API_URL}/works`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const newWork = await response.json();
            if (divGallery) {
                divGallery.appendChild(createGalleryItem(newWork, false));
            }
            if (divGalleryModal) {
                divGalleryModal.appendChild(createGalleryItem(newWork, true));
            }
            alert("Travail ajouté avec succès !");
            submitButton.classList.remove("active");
            submitButton.disabled = true;
            resetPreview();
        } else {
            handleSubmitError(response.status);
        }
    } catch (error) {
        alert("Erreur réseau. Veuillez réessayer plus tard.");
        console.error(error);
    }

}

function handleSubmitError(status) {
    switch (status) {
        case 400:
            alert("Merci de remplir tous les champs.");
            break;
        case 401:
            alert("Vous n'êtes pas autorisé.");
            window.location.href = "login.html";
            break;
        case 500:
            alert("Erreur serveur.");
            break;
        default:
            alert("Une erreur est survenue.");
    }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    displayWorks();
    displayCategories();
    initializeModal();

});



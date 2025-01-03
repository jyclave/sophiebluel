function updateLoginState() {
  const token = localStorage.getItem("token"); // Vérifie si un token est présent
  const loginItem = document.querySelector("li#login"); // Cible l'élément <li> avec l'id "login"
  const topBar = document.getElementById("top-bar"); // Cible l'élément de la top bar avec la classe correspondante
  const spanTopBar = document.getElementById("span-top-bar");
  const filtersElement = document.querySelector(".filters");

  if (token) {
    // Si un token est présent, changer en "Logout"
    loginItem.textContent = "Logout";

    // Afficher la top bar en retirant la classe .hidden
    if (topBar) {
      topBar.classList.remove("hidden");
    }
    if (spanTopBar) {
      spanTopBar.classList.remove("hidden");
    }
    if (filtersElement) {
      filtersElement.classList.add('hidden');
    };
    

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

    if (spanTopBar) {
      spanTopBar.classList.add("hidden");
    }
    
    if (filtersElement) {
       filtersElement.classList.remove("hidden");
    }
    
    // Ajouter un écouteur pour rediriger vers login.html
    loginItem.addEventListener("click", () => {
      location.href = "login.html"; // Redirige vers la page de connexion
    });
  }
}

// Appeler cette fonction dès que la page est chargée
document.addEventListener("DOMContentLoaded", updateLoginState);

console.log("fichier login js chargé");

const form = document.querySelector("form");

function userLogin() {
  // Ajout d'un écouteur d'événement pour soumettre le formulaire
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs saisies par l'utilisateur
    const email = form.querySelector("input[name='email']").value;
    const password = form.querySelector("input[name='password']").value;

    // Préparer les données pour la requête
    const userData = {
      email: email,
      password: password,
    };

    // Effectuer une requête POST vers l'API
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), // Convertir les données en JSON
    })
      .then((response) => {
        if (!response.ok) {
          // modification des case 401 et 404
          switch (response.status) {
            case 401:
              alert("Email ou mot de passe incorrect.");
              break;
            case 404:
              alert("Utilisateur non trouvé. Vérifiez votre email.");
              break;
            case 200:
                console.log("Authentification réussie"); 
            default:
              alert("Une erreur inconnue s'est produite.");
          }
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Connexion réussie :", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        location.href = "index.html";
      })
      .catch((error) => {
        console.error("Erreur :", error.message);
        // Le message d'erreur est déjà affiché via alert.
      });
  });
}

userLogin();






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
          throw new Error("Erreur de connexion");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Connexion réussie :", data);
        // Traiter la réponse (par exemple, rediriger l'utilisateur)
      })
      .catch((error) => {
        console.error("Erreur :", error.message);
        // Afficher un message d'erreur à l'utilisateur
      });
  });
}

userLogin();



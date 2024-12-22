function displayWorks() {
  console.log("fichier script.js chargé ");
  let divGallery = document.querySelector(".gallery");
  // suite du code à faire ici pour l instant
  console.log(fetch("http://localhost:5678/api/works"));
}

displayWorks();

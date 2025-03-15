// Asegurarnos de que el DOM esté completamente cargado antes de ejecutar el script
window.onload = function() {
    // Verificar si el modal existe antes de intentar acceder a él
    const termsModal = document.getElementById("termsModal");
    
    if (termsModal) {
        // Mostrar el modal de términos y condiciones
        termsModal.style.display = "block";

        // Función para aceptar los términos
        window.acceptTerms = function() {
            alert("Has aceptado los términos y condiciones.");
            termsModal.style.display = "none";
        }

        // Función para denegar los términos
        window.denyTerms = function() {
            alert("No has aceptado los términos y condiciones.");
            termsModal.style.display = "none";
        }
    } else {
        console.error("El modal de términos no se ha encontrado en el HTML.");
    }
};

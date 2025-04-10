function rankuitleg() {
    document.querySelector(".modecirkel").classList.toggle("active");
    document.querySelector(".uitleg").classList.toggle("active");
    
}

document.querySelector(".logout").addEventListener("click", function() {
    // Clear session storage
    sessionStorage.clear();

    // Redirect to another page
    window.location.href = "/inlog_pagina/index.html";
});
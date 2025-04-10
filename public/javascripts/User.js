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

// Get the saved username from sessionStorage
document.getElementById('user').value = sessionStorage.getItem('username');

//vanaf hier is password change code
document.querySelector('.opslaan').addEventListener('click', () => {
    const password = document.getElementById('pw').value;
    const UserId = sessionStorage.getItem('UserId');
  
    if (!password) {
      alert('Please enter a new password.');
      return;
    }
  
    fetch('/api/changepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ UserId, password })
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the password.');
      });
  });
  
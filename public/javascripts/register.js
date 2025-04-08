document.querySelector('.register').addEventListener('click', async function() {
    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;
    const password2 = document.querySelector('.password2').value;


  //passwords check
  if (password !== password2) {
    alert("Passwords do not match!");
    return;
  }

  // Send a POST request to the server to register user
  fetch('/api/registerANDcrosscheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password, password2})
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Username already exists!') {
      alert(data.message);  
    } else if (data.message === 'Passwords do not match!') {
      alert(data.message);  
    } else if (data.message === 'User registered successfully') {
      alert('Registration successful! You can now log in.');
      window.location.href = '/inlog_pagina/index.html';  
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred during registration.');
  });
});

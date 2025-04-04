document.querySelector('.login-button').addEventListener('click', async function() {
    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;

    if (!username || !password) {
        alert("Both username and password are required!");
        return;
    }

    try {
        // Make API request to check username and password
        const response = await fetch('http://localhost:3000/api/CheckUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log("Response data:", data);//log om json te zien


        if (data.exists) {
            alert("Login successful!");
            window.location.href = '/register_pagina/index.html';
            // Handle success (e.g., redirect to a new page or store token)
        } else {
            alert("Invalid username or password.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

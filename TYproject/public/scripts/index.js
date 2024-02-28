// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBj1haaSvpv6SHe8PwX5wazT56DahPOKQQ",
    authDomain: "snaplooks-bd932.firebaseapp.com",
    databaseURL: "https://snaplooks-bd932-default-rtdb.firebaseio.com",
    projectId: "snaplooks-bd932",
    storageBucket: "snaplooks-bd932.appspot.com",
    messagingSenderId: "680311673132",
    appId: "1:680311673132:web:5d55f0b0fe817b8ac39c89"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Function to open the modal
function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = 1;
    }, 100);
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.opacity = 0;
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}

// Function for the "Continue with Google" button
async function continueWithGoogle() {
const provider = new firebase.auth.GoogleAuthProvider();

try {
// Sign in with Google
const result = await firebase.auth().signInWithPopup(provider);

// If successful, redirect to home.html
window.location.href = 'home.html';
} catch (error) {
console.error(error.message);
// Handle authentication error if needed
}
}
// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target === document.getElementById('myModal')) {
        closeModal();
    }
};

// Assuming you have an HTML anchor with class="spa-link"
const spaLinks = document.querySelectorAll('.spa-link');

// Event listener for each link
spaLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const target = link.getAttribute('data-target');
        navigateTo(target);

        // Update the URL without a page reload
        history.pushState({ page: target }, null, `/${target}`);
    });
});

// Function to handle navigation
function navigateTo(target) {
    // Make a POST request to the server's corresponding route
    fetch(`/${target}`, {
        method: 'POST', // or 'GET' depending on your server configuration
        headers: {
            'Content-Type': 'application/json',
        },
        // You can include a body if needed
        // body: JSON.stringify({ /* data */ }),
    })
    .then(response => response.json()) // Assuming the server returns JSON
    .then(data => {
        // Handle the response data as needed
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const firebaseConfig = {
    apiKey: "AIzaSyBj1haaSvpv6SHe8PwX5wazT56DahPOKQQ",
    authDomain: "snaplooks-bd932.firebaseapp.com",
    databaseURL: "https://snaplooks-bd932-default-rtdb.firebaseio.com/",
    projectId: "snaplooks-bd932",
    storageBucket: "snaplooks-bd932.appspot.com",
    messagingSenderId: "680311673132",
    appId: "1:680311673132:web:5d55f0b0fe817b8ac39c89"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function adminLogin() {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    const loadingSpinner = document.getElementById("loadingSpinner");
    const messageContainer = document.getElementById("messageContainer");

    // Check if either username or password is empty
    if (!username || !password) {
        // Display an error message to the user
        messageContainer.innerHTML = "Username and password are required.";
        return; // Skip login logic
    }

    // Clear any previous error messages
    messageContainer.innerHTML = "";

    // Display loading spinner while processing
    loadingSpinner.style.display = "block";

    // Perform login logic using Firebase authentication
    firebase.auth().signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            // Successfully logged in as admin
            console.log("Admin logged in successfully:", userCredential.user);
            window.location.href = "admin.html";
        })
        .catch((error) => {
            // Handle login errors
            console.error("Error logging in as admin:", error.message);

            // Display user-friendly error message
            let errorMessage;
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    errorMessage = "Error";
                    break;
                default:
                    errorMessage = "Invalid username or password.";
                    break;
            }

            // Display the error message in the container
            messageContainer.innerHTML = errorMessage;
        })
        .finally(() => {
            // Hide loading spinner after processing
            loadingSpinner.style.display = "none";
        });
}


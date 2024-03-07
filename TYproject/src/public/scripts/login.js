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

function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.querySelector('.toggle-button.active').innerText.toLowerCase();
    const loadingSpinner = document.getElementById("loadingSpinner");

    // Check if the email or password is empty
    if (email === "" || password === "") {
        displayMessage("Please enter both email and password.", true);
        return;
    }

    if (loadingSpinner) {
        loadingSpinner.style.display = "block";
    } else {
        console.error("Loading spinner element not found.");
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Check if the email is verified
            if (user.emailVerified) {
                const userId = user.uid;
                const approvedCollection = (userType === 'salon') ? 'approved' : 'approved_freelancers';

                // Check if the salon/freelancer is approved by admin
                firebase.firestore().collection(approvedCollection).doc(userId).get()
                    .then((approvedDoc) => {
                        if (approvedDoc.exists) {
                            // Salon or freelancer is approved
                            if (userType === 'salon') {
                                window.location.href = "salon_dashboard.html";
                            } else if (userType === 'freelancer') {
                                window.location.href = "freelancer_dashboard.html";
                            } else {
                                displayMessage("Invalid user type.", true);
                            }
                        } else {
                            // Salon or freelancer is not yet approved
                            // Redirect to profile page for non-approved users
                            if (userType === 'salon') {
                                window.location.href = "profile_salone.html";
                            } else if (userType === 'freelancer') {
                                window.location.href = "profile_freelancer.html";
                            } else {
                                displayMessage("Invalid user type.", true);
                            }
                        }
                    })
                    .catch((error) => {
                        displayMessage(error.message, true);
                    });
            } else {
                // Email is not verified
                displayMessage("Please verify your email before logging in.", true);
                // You can optionally trigger a resend verification email here
            }
        })
        .catch((error) => {
            let errorMessage = error.message;
        
            // Extract a more user-friendly message for specific errors
            if (error.code === "auth/invalid-login-credentials") {
                errorMessage = "Invalid email or password";
            }
        
            displayMessage(errorMessage, true);
        })
        .finally(() => {
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            } else {
                console.error("Loading spinner element not found.");
            }
        });
}

function resetPassword() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const loadingSpinner = document.getElementById("loadingSpinner");

    // Check if the email is empty
    if (email === "") {
        displayMessage("Please enter your email address in the Email field.", true);
        return;
    }

    if (loadingSpinner) {
        loadingSpinner.style.display = "block";
    } else {
        console.error("Loading spinner element not found.");
    }

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            displayMessage("Password reset email sent. Check Email!");
        })
        .catch((error) => {
            // Check if the error is due to the email not being found
            if (error.code === "auth/user-not-found") {
                displayMessage("No account found with this email address. Please enter a valid email or register for a new account.", true);
            } else {
                displayMessage(error.message, true);
            }
        })
        .finally(() => {
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            } else {
                console.error("Loading spinner element not found.");
            }
        });
}
function displayMessage(message, isError = false) {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
        messageContainer.innerHTML = `<p class="${isError ? 'error-message' : 'success-message'}">${message}</p>`;
    } else {
        console.error("Message container element not found.");
    }
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "visibility_off";
    } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "visibility";
    }
}
function setUserType(type) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => button.classList.remove('active'));

    const selectedButton = Array.from(buttons).find(button => button.innerText.toLowerCase() === type.toLowerCase());
    selectedButton.classList.add('active');
}

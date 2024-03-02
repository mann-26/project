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

function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.querySelector('.toggle-button.active').innerText.toLowerCase();
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessageContainer = document.getElementById("registrationErrorMessage");
    const successMessageContainer = document.getElementById("registrationSuccessMessage");

    if (!email || !password) {
        errorMessageContainer.innerHTML = "Please enter both email and password.";
        return;
    }

    if (password.length < 5) {
        if (errorMessageContainer) {
            errorMessageContainer.innerHTML = "Password should be at least 5 characters long.";
        } else {
            console.error("Error: errorMessageContainer not found.");
        }
        return;
    }

    loadingSpinner.style.display = "block";

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.sendEmailVerification();

            const userId = userCredential.user.uid;
            const userCollection = (userType === 'salon') ? 'R_salons' : 'R_freelancers';

            firebase.firestore().collection(userCollection).doc(userId).set({
                email: email,
            })
            .then(() => {
                showModal("Registration Processed! Please check your email for verification.");
                loadingSpinner.style.display = "none"; // Hide the loading spinner immediately
            })
            .catch((error) => {
                if (errorMessageContainer) {
                    errorMessageContainer.innerHTML = "Error storing user data in Firestore: " + error.message;
                } else {
                    console.error("Error: errorMessageContainer not found.");
                }
                loadingSpinner.style.display = "none"; // Hide the loading spinner in case of an error
            });
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                // Email is already in use; check existing user type
                const existingUserType = (userType === 'salon') ? 'R_salons' : 'R_freelancers';

                firebase.firestore().collection(existingUserType).where('email', '==', email).get()
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            // Email is already associated with an account of the same type
                            errorMessageContainer.innerHTML = "Email already in use for " + userType;
                        } else {
                            // Email is in use for a different type
                            errorMessageContainer.innerHTML = "Email already in use for a different account type";
                        }
                        loadingSpinner.style.display = "none"; // Hide the loading spinner
                    })
                    .catch((queryError) => {
                        console.error("Error checking existing user type:", queryError);
                        loadingSpinner.style.display = "none"; // Hide the loading spinner in case of an error
                    });
            } else {
                if (errorMessageContainer) {
                    errorMessageContainer.innerHTML = "Error: " + error.message;
                } else {
                    console.error("Error: errorMessageContainer not found.");
                }
                loadingSpinner.style.display = "none"; // Hide the loading spinner in case of an error
            }
        });
    }

  function showModal(message) {
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    const loadingSpinner = document.getElementById("loadingSpinner");

    modalMessage.innerHTML = message;
    modal.style.display = "block";
    loadingSpinner.style.display = "none"; // Hide the loading spinner

    const modalOkBtn = document.getElementById("modalOkBtn");
    modalOkBtn.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "login.html";
    });
}

function setUserType(type) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => button.classList.remove('active'));

    const selectedButton = Array.from(buttons).find(button => button.innerText.toLowerCase() === type.toLowerCase());
    selectedButton.classList.add('active');
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
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

    loadingSpinner.style.display = "block";

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.sendEmailVerification();

            const userId = userCredential.user.uid;
            const userCollection = (userType === 'salon') ? 'R_salons' : 'R_freelancers';

            firebase.firestore().collection(userCollection).doc(userId).set({
                email: email,
                // Add other fields as needed
            })
                .then(() => {
                    alert("Registration proceeded! Please check your email for verification.");
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    alert("Error storing user data in Firestore: " + error.message);
                });
        })
        .catch((error) => {
            alert("Error creating user: " + error.message);
        })
        .finally(() => {
            loadingSpinner.style.display = "none";
        });
}

function setUserType(type) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => button.classList.remove('active'));

    const selectedButton = Array.from(buttons).find(button => button.innerText.toLowerCase() === type.toLowerCase());
    selectedButton.classList.add('active');
}
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
                                alert("Invalid user type.");
                            }
                        } else {
                            // Salon or freelancer is not yet approved
                            // Redirect to profile page for non-approved users
                            if (userType === 'salon') {
                                window.location.href = "profile_salone.html";
                            } else if (userType === 'freelancer') {
                                window.location.href = "profile_freelancer.html";
                            } else {
                                alert("Invalid user type.");
                            }
                        }
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            } else {
                // Email is not verified
                alert("Please verify your email before logging in.");
                // You can optionally trigger a resend verification email here
            }
        })
        .catch((error) => {
            alert(error.message);
        })
        .finally(() => {
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            } else {
                console.error("Loading spinner element not found.");
            }
        });
}

function setUserType(type) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => button.classList.remove('active'));

    const selectedButton = Array.from(buttons).find(button => button.innerText.toLowerCase() === type.toLowerCase());
    selectedButton.classList.add('active');
}
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

function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

const checkAuthentication = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            console.log("User is authenticated:", user.displayName);

            // Update the profile picture
            const userProfilePicture = document.getElementById('userProfilePicture');
            userProfilePicture.src = user.photoURL;

            // Check if the user has already created a profile
            checkProfileCreated();
            fetchUserProfile(user.uid);
        } else {
            // User is signed out
            console.log("User is not authenticated");
            hideLoadingSpinner();
        }
    });
};

function fetchUserProfile(userId) {
    const db = firebase.firestore();
    const usersCollection = db.collection('users');

    usersCollection.doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userNameDisplay = document.getElementById('userNameDisplay');
                const userEmailDisplay = document.getElementById('userEmailDisplay');
                const userContactDisplay = document.getElementById('userContactDisplay');
                const userAddressDisplay = document.getElementById('userAddressDisplay');

                userNameDisplay.textContent = doc.data().displayName;
                userEmailDisplay.innerHTML = "<strong>Email:</strong> " + doc.data().email;
                userContactDisplay.innerHTML = "<strong>Contact Number:</strong> " + doc.data().contactNumber;
                userAddressDisplay.innerHTML = "<strong>Address:</strong> " + doc.data().address;

                hideLoadingSpinner();
            } else {
                console.log("No such document!");
                hideLoadingSpinner();
            }
        })
        .catch((error) => {
            console.error("Error fetching user profile:", error);
            hideLoadingSpinner();
        });
}

function openUserModal(name, email, profilePictureUrl) {
    const userModal = document.getElementById('userModal');
    const userModalProfilePicture = document.getElementById('userModalProfilePicture');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');

    // Set user information in the modal
    userModalProfilePicture.src = profilePictureUrl;
    userNameInput.value = name;
    userEmailInput.value = email;

    // Display the modal
    userModal.style.display = 'block';
}

function closeUserModal() {
    const userModal = document.getElementById('userModal');
    userModal.style.display = 'none';
}

window.onload = checkAuthentication;

document.addEventListener('DOMContentLoaded', function () {
    const profilePictureContainer = document.querySelector('.profile-picture-container');
    const sideSection = document.getElementById('sideSection');
    const closeSideSectionBtn = document.getElementById('closeSideSection');
    const modal = document.querySelector('.mod');

    modal.addEventListener('animationend', function () {
        modal.classList.add('blurred-background');
    });

    profilePictureContainer.addEventListener('click', function () {
        sideSection.style.transition = 'right 0.3s ease-in-out';
        sideSection.style.right = '0';
    });

    closeSideSectionBtn.addEventListener('click', function () {
        sideSection.style.transition = 'right 0.3s ease-in-out';
        sideSection.style.right = '-300px'; // Adjust the value based on your side section width
    });

    document.getElementById('logoutBtn').addEventListener('click', function () {
        // Perform Firebase logout
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log('User signed out');
            window.location.href = 'index.html'; // Redirect to the index.html page
        }).catch(function (error) {
            // An error happened.
            console.error('Error during sign-out:', error);
        });
    });
});

function handleLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
}

function checkProfileCreated() {
    const user = firebase.auth().currentUser;

    if (user) {
        const db = firebase.firestore();
        const usersCollection = db.collection('users');

        usersCollection.doc(user.uid).get()
            .then((doc) => {
                if (doc.exists && doc.data().profileCreated) {
                    // User has already created a profile, you can skip showing the modal
                    console.log("Profile already created");
                    hideLoadingSpinner();
                } else {
                    // User has not created a profile, show the modal
                    console.log("Profile not created");
                    showLoadingSpinner();
                    openUserModal(user.displayName, user.email, user.photoURL);
                }
            })
            .catch((error) => {
                console.error("Error checking profile:", error);
                hideLoadingSpinner();
            });
    } else {
        // User not authenticated, handle accordingly
        console.error("User not authenticated");
        hideLoadingSpinner();
    }
}

window.onload = function () {
    showLoadingSpinner(); // Show the loading spinner when the page is loaded
    checkAuthentication();
};

function createProfile() {
    const user = firebase.auth().currentUser;

    if (user) {
        const db = firebase.firestore();
        const usersCollection = db.collection('users');

        // Get values from the modal
        const contactNumber = document.getElementById('userContact').value;
        const address = document.getElementById('userAddress').value;

        // Update user profile in Firestore
        usersCollection.doc(user.uid).set({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            contactNumber: contactNumber,
            address: address,
            profileCreated: true,
        }, { merge: true })
            .then(() => {
                console.log("Profile created successfully");

                // Update content in the profile-section immediately
                const userNameDisplay = document.getElementById('userNameDisplay');
                const userEmailDisplay = document.getElementById('userEmailDisplay');
                const userContactDisplay = document.getElementById('userContactDisplay');
                const userAddressDisplay = document.getElementById('userAddressDisplay');

                userNameDisplay.textContent = user.displayName;
                userEmailDisplay.textContent = "Email: " + user.email;
                userContactDisplay.textContent = "Contact Number: " + contactNumber;
                userAddressDisplay.textContent = "Address: " + address;

                // Close the modal
                closeUserModal();
                hideLoadingSpinner();

                // Perform additional actions if needed
            })
            .catch((error) => {
                console.error("Error creating profile:", error);
            });
    } else {
        // User not authenticated, handle accordingly
        console.error("User not authenticated");
    }
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Function to handle errors in location retrieval
function handleLocationError(error) {
    console.error("Error getting location:", error.message);
    // You can handle errors here, such as displaying a message to the user
}

// Try to fetch the user's location using the Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleLocation, handleLocationError);
} else {
    console.error("Geolocation is not supported by this browser");
    // You can handle this case, such as displaying a message to the user
}
function openCustomerBookings() {
    window.location.href = 'YourBookings.html';
}
// Function to handle location
function handleLocation(pos) {
    position = pos.coords;
    var latitude = position.latitude;
    var longitude = position.longitude;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
}
// Function to handle errors in location retrieval
function handleLocationError(error) {
    console.error("Error getting location:", error.message);
    // You can handle errors here, such as displaying a message to the user
}
// Try to fetch the user's location using the Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleLocation, handleLocationError);
} else {
    console.error("Geolocation is not supported by this browser");
    // You can handle this case, such as displaying a message to the user
}
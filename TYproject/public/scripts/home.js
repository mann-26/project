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
var db = firebase.firestore();

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
        const contactNumberInput = document.getElementById('userContact');
        const addressInput = document.getElementById('userAddress');

        // Get values from the modal
        const contactNumber = contactNumberInput.value.trim(); // Trim to remove leading/trailing spaces
        const address = addressInput.value.trim();

        // Clear previous error messages
        clearErrorMessages();

        // Validate required fields
        if (!contactNumber) {
            displayErrorMessage(contactNumberInput, 'Please enter your contact number.');
            return; // Exit the function if validation fails
        }

        if (!address) {
            displayErrorMessage(addressInput, 'Please enter your address.');
            return; // Exit the function if validation fails
        }

        // Update user profile in Firestore
        const db = firebase.firestore();
        const usersCollection = db.collection('users');

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

                // Display a tick mark
                const tickMark = document.createElement('span');
                tickMark.innerHTML = '&#10004; Profile Created!';
                tickMark.classList.add('tick-mark');
                tickMark.style.marginLeft = '10px'; // Adjust the spacing

                // Append the tick mark to the user modal
                const userModalContent = document.querySelector('#userModal .modal-cont');
                userModalContent.appendChild(tickMark);

                // Close the modal after a delay (adjust the timing if needed)
                setTimeout(() => {
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
                }, 2000); // 10 seconds delay
            })
            .catch((error) => {
                console.error("Error creating profile:", error);
            });
    } else {
        // User not authenticated, handle accordingly
        console.error("User not authenticated");
    }
}

// Function to display an error message next to the input field
function displayErrorMessage(inputElement, message) {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;

    // Append the error message to the parent container
    inputElement.parentNode.appendChild(errorMessage);

    // Add an event listener to both input elements
    const checkAndRemoveError = function () {
        const contactNumber = document.getElementById('userContact').value.trim();
        const address = document.getElementById('userAddress').value.trim();

        // Check if both fields are filled, and remove the error message if true
        if (contactNumber && address) {
            errorMessage.remove();
        }
    };

    inputElement.addEventListener('input', checkAndRemoveError);

    // You can add the same event listener to the other input element if needed
}


// Function to clear all error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
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

var debounceTimer;

async function searchFreelancerByService(serviceInput) {
    var searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (serviceInput === '') {
        clearSearchResults();
        return;
    }

    try {
        var freelancerQuerySnapshot = await db.collection('approved_freelancers').get();
        var fragment = document.createDocumentFragment();
        var foundResults = false;

        freelancerQuerySnapshot.forEach((doc) => {
            var freelancerData = doc.data();
            var matchingServices = freelancerData.selectedServices.filter(service =>
                service.name && typeof service.name === 'string' && service.name.toLowerCase().includes(serviceInput)
            );

            if (matchingServices.length > 0) {
                foundResults = true;

                var freelancerEntry = document.createElement('div');
                freelancerEntry.className = 'searchResult';

                // Add profile image
                var freelancerProfileImage = document.createElement('img');
                freelancerProfileImage.src = freelancerData.freelancerDpImage; // Adjust the field name based on your database structure
                freelancerProfileImage.alt = 'Freelancer Profile Image';
                freelancerProfileImage.className = 'profileImage';
                freelancerEntry.appendChild(freelancerProfileImage);

                // Add freelancer indication text
                var freelancerIndication = document.createElement('p');
                freelancerIndication.textContent = 'Freelancer';
                freelancerIndication.className = 'FresultIndication';
                freelancerEntry.appendChild(freelancerIndication);

                var freelancerNameElement = document.createElement('p');
                freelancerNameElement.textContent = freelancerData.freelancerName;
                freelancerNameElement.className = 'freelancerName';
                freelancerEntry.appendChild(freelancerNameElement);

                matchingServices.forEach(service => {
                    var serviceElement = document.createElement('p');
                    serviceElement.textContent = `Service: ${service.name}, Price: ${service.price}`;
                    freelancerEntry.appendChild(serviceElement);
                });

                freelancerEntry.addEventListener('click', function () {
                    localStorage.setItem('selectedFreelancer', JSON.stringify(freelancerData));
                    window.location.href = 'freelancer_details.html?freelancerId=' + doc.id;
                });

                fragment.appendChild(freelancerEntry);
            }
        });

        searchResults.appendChild(fragment);
        toggleSearchResults(true);
    } catch (error) {
        console.error("Error searching for freelancers:", error);
    }
}

async function searchSalonByService(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async function () {
        var serviceInput = document.getElementById('serviceInput').value.toLowerCase().trim();

        if (serviceInput === '') {
            clearSearchResults();
            return; // Return early if the input is empty
        }

            // Search for salons and freelancers
        searchSalonResults(serviceInput);
        searchFreelancerByService(serviceInput);
    }, 300);
}

async function searchSalonResults(serviceInput) {
        var searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        try {
            var salonQuerySnapshot = await db.collection('approved').get();
            var fragment = document.createDocumentFragment();

            salonQuerySnapshot.forEach((doc) => {
                var salonData = doc.data();

                if (Array.isArray(salonData.selectedServices)) {
                    var matchingServices = salonData.selectedServices.filter(service =>
                        service.name && typeof service.name === 'string' && service.name.toLowerCase().includes(serviceInput)
                    );

                    if (matchingServices.length > 0) {
                        var salonEntry = document.createElement('div');
                        salonEntry.className = 'searchResult';

                        // Add profile image
                        var salonProfileImage = document.createElement('img');
                        salonProfileImage.src = salonData.salonDpImage; // Adjust the field name based on your database structure
                        salonProfileImage.alt = 'salon Profile Image';
                        salonProfileImage.className = 'profileImage';
                        salonEntry.appendChild(salonProfileImage);

                        // Add freelancer indication text
                        var salonIndication = document.createElement('p');
                        salonIndication.textContent = 'salon';
                        salonIndication.className = 'SresultIndication';
                        salonEntry.appendChild(salonIndication);

                        var salonNameElement = document.createElement('p');
                        salonNameElement.textContent = salonData.salonName;
                        salonNameElement.className = 'salonName';
                        salonEntry.appendChild(salonNameElement);

                        matchingServices.forEach(service => {
                            var serviceElement = document.createElement('p');
                            serviceElement.textContent = `Service: ${service.name}, Price: ${service.price}`;
                            salonEntry.appendChild(serviceElement);
                        });

                        salonEntry.addEventListener('click', function () {
                            localStorage.setItem('selectedSalon', JSON.stringify(salonData));
                            window.location.href = 'salon_details.html?salonId=' + doc.id;
                        });

                        fragment.appendChild(salonEntry);
                    }
                }
            });

            searchResults.appendChild(fragment);
            toggleSearchResults(true);
        } catch (error) {
            console.error("Error searching for salons:", error);
        }
    }

function clearSearchResults() {
    var searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    toggleSearchResults(false);
}



function toggleSearchResults(show = false) {
    var searchResults = document.getElementById('searchResults');
    if (show || searchResults.innerHTML !== '') {
        searchResults.classList.toggle('show', show);
    } else {
        searchResults.classList.remove('show');
    }
}

document.getElementById('serviceInput').addEventListener('focus', function () {
    searchSalonByService();
});

document.getElementById('serviceInput').addEventListener('input', function () {
    updateAutocompleteSuggestions();
});

async function updateAutocompleteSuggestions() {
    var serviceInput = document.getElementById('serviceInput').value.toLowerCase().trim();
    var suggestionsDatalist = document.getElementById('serviceSuggestions');

    try {
        var suggestionsSet = new Set();

        await fetchSalonSuggestions(serviceInput, suggestionsSet);
        await fetchFreelancerSuggestions(serviceInput, suggestionsSet);

        suggestionsDatalist.innerHTML = '';

        suggestionsSet.forEach(suggestion => {
            var option = document.createElement('option');
            option.value = suggestion;
            suggestionsDatalist.appendChild(option);
        });
    } catch (error) {
        console.error("Error updating autocomplete suggestions:", error);
    }
}

async function fetchSalonSuggestions(serviceInput, suggestionsSet) {
    try {
        var salonQuerySnapshot = await db.collection('approved').get();

        salonQuerySnapshot.forEach((doc) => {
            var salonData = doc.data();

            if (Array.isArray(salonData.selectedServices)) {
                salonData.selectedServices.forEach(service => {
                    if (service.name && typeof service.name === 'string' && service.name.toLowerCase().includes(serviceInput)) {
                        suggestionsSet.add(service.name);
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error fetching salon suggestions:", error);
    }
}

async function fetchFreelancerSuggestions(serviceInput, suggestionsSet) {
    try {
        var freelancerQuerySnapshot = await db.collection('approved_freelancers').get();

        freelancerQuerySnapshot.forEach((doc) => {
            var freelancerData = doc.data();

            freelancerData.selectedServices.forEach(service => {
                if (service.name && typeof service.name === 'string' && service.name.toLowerCase().includes(serviceInput)) {
                    suggestionsSet.add(service.name);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching freelancer suggestions:", error);
    }
}


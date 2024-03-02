var firebaseConfig = {
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
var db = firebase.firestore();


// Function to hide both salon and freelancer data initially
function hideAllData() {
    document.getElementById('questionList').style.display = 'none';
    document.getElementById('salonList').style.display = 'none';
    document.getElementById('freelancerList').style.display = 'none';
    document.getElementById('queryList').style.display = 'none';
}


function showSalonData() {
    hideAllData();
    document.getElementById('salonList').style.display = 'block';
    fetchSalonData();
    document.getElementById('dashboardHeader').innerText = "Salon Data";
}

function showFreelancerData() {
    hideAllData();
    document.getElementById('freelancerList').style.display = 'block';
    fetchFreelancerData();
    document.getElementById('dashboardHeader').innerText = "Freelancer Data";
}

function showQuestionData() {
    hideAllData();
    document.getElementById('questionList').style.display = 'block';
    fetchQuestionData();
    document.getElementById('dashboardHeader').innerText = "Questions Asked";
}

function showQueryData() {
    hideAllData();
    document.getElementById('queryList').style.display = 'block';
    fetchQueryData();
    document.getElementById('dashboardHeader').innerText = "User Queries";
}

function logout() {
    // Add your logout logic here, such as clearing authentication tokens or any other necessary steps.

    // For the sake of this example, let's redirect to the index.html file.
    window.location.href = 'admin_login.html';
}

function fetchSalonData() {
    var salonList = document.getElementById('salonList');

    db.collection('salons').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                salonList.innerHTML = '<p>No salon applications found.</p>';
            } else {
                salonList.innerHTML = ''; // Clear the existing content
                querySnapshot.forEach((doc) => {
                    var salonData = doc.data();
                    console.log('Salon Data:', salonData); // Log all salon data for debugging

                    // Create a container for each salon
                    var salonContainer = document.createElement('div');
                    salonContainer.classList.add('salon-container');

                    salonContainer.innerHTML = `
                    <div class="application-details">
                        <img src="${salonData.salonDpImage}" alt="Salon DP">
                    </div>

                    <h3 onclick="toggleDetails(this)">${salonData.salonName}</h3>
                <div class="details">
                    <p><strong>Owner's Name:</strong> ${salonData.ownerName}</p>
                    <p><strong>Location:</strong> ${salonData.areaName}</p>
                    <p><strong>Contact:</strong> ${salonData.contact}</p>
                    <p><strong>Open Time:</strong> ${salonData.openTime}</p>
                    <p><strong>Close Time:</strong> ${salonData.closeTime}</p>
                    <p><strong>Working Days:</strong> ${salonData.workingDays ? salonData.workingDays.join(', ') : 'N/A'}</p>
                    <p><strong>Services Provided By Salon:</strong></p>
                    <ul>
                    ${salonData.selectedServices ? salonData.selectedServices.map(service => `
                        <li style="margin-left: 40px;">
                        <strong>Name:</strong> ${service.name}<br>
                        <strong>Description:</strong> ${service.description}<br>
                        <strong>Price:</strong> ${service.price}<br>
                        <img src="${service.image}" alt="Service Image" style="max-width: 100%; height: 50px; margin-top: 10px; border-radius: 50px;">
                        </li>
                    `).join('') : '<li>N/A</li>'}
                    </ul>

                    <div class="actions-container">
                    <button class="btn btn-success approve-btn" onclick="approveSalon('${doc.id}')">Approve</button>
                    <button class="btn btn-danger decline-btn" onclick="declineSalon('${doc.id}')">Decline</button>
                </div>

                </div>
                    `;
                    function toggleButtonsVisibility(element) {
                        var buttonsContainer = element.nextElementSibling.querySelector('.actions-container');
                        if (buttonsContainer.style.display === 'block') {
                            buttonsContainer.style.display = 'none';
                        } else {
                            buttonsContainer.style.display = 'block';
                        }
                    }
                    

                    salonList.appendChild(salonContainer);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching salons: ", error);
        });
}


function fetchFreelancerData() {
    var freelancerList = document.getElementById('freelancerList');

    db.collection('freelancers').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                freelancerList.innerHTML = '<p>No freelancer applications found.</p>';
            } else {
                freelancerList.innerHTML = ''; // Clear the existing content
                querySnapshot.forEach((doc) => {
                    var freelancerData = doc.data();
                    console.log('Freelancer Data:', freelancerData); // Log all freelancer data for debugging

                    // Create a container for each freelancer
                    var freelancerContainer = document.createElement('div');
                    freelancerContainer.classList.add('salon-container'); // Keeping the same class for styling consistency

                    freelancerContainer.innerHTML = `
                    <div class="application-details">
                        <img src="${freelancerData.freelancerDpImage}" alt="Freelancer DP">
                    </div>

                    <h3 onclick="toggleDetails(this)">${freelancerData.freelancerName}</h3>
                    <div class="details">
                        <p><strong>Freelancer's Name:</strong> ${freelancerData.freelancerName}</p>
                        <p><strong>Location:</strong> ${freelancerData.areaName}</p>
                        <p><strong>Contact:</strong> ${freelancerData.contact}</p>
                        <p><strong>Open Time:</strong> ${freelancerData.openTime}</p>
                        <p><strong>Close Time:</strong> ${freelancerData.closeTime}</p>
                        <p><strong>Working Days:</strong> ${freelancerData.workingDays ? freelancerData.workingDays.join(', ') : 'N/A'}</p>
                        <p><strong>Services Provided By Salon:</strong></p>
                        <ul>
                            ${freelancerData.selectedServices ? freelancerData.selectedServices.map(service => `
                                <li style="margin-left: 40px;">
                                <strong>Name:</strong> ${service.name}<br>
                                <strong>Description:</strong> ${service.description}<br>
                                <strong>Price:</strong> ${service.price}<br>
                                <img src="${service.image}" alt="Service Image" style="max-width: 100%; height: 50px; margin-top: 10px; border-radius: 50px;">
                                </li>
                            `).join('') : '<li>N/A</li>'}
                        </ul>

                    <div class="actions-container">
                        <button class="btn btn-success approve-btn" onclick="approveFreelancer('${doc.id}')">Approve</button>
                        <button class="btn btn-danger decline-btn" onclick="declineFreelancer('${doc.id}')">Decline</button>
                    </div>

                    </div>
                    `;

                    freelancerList.appendChild(freelancerContainer);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching freelancers: ", error);
        });
}


function fetchQuestionData() {
    var questionList = document.getElementById('questionList');

    db.collection('question_asked').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                questionList.innerHTML = '<p>No questions found.</p>';
            } else {
                questionList.innerHTML = ''; // Clear the existing content

                // Counter for numbering questions
                let questionCounter = 1;

                querySnapshot.forEach((doc) => {
                    var questionData = doc.data();
                    var questionEntry = document.createElement('div');
                    questionEntry.classList.add('application');
                    questionEntry.innerHTML = `
                        <h3>${questionCounter}. ${questionData.question}</h3>
                        <!-- Add other details as needed -->
                    `;

                    questionList.appendChild(questionEntry);

                    // Increment the question counter
                    questionCounter++;
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching questions: ", error);
        });
}

function fetchQueryData() {
    var queryList = document.getElementById('queryList');

    db.collection('user_queries').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                queryList.innerHTML = '<p>No user queries found.</p>';
            } else {
                queryList.innerHTML = ''; // Clear the existing content
                querySnapshot.forEach((doc) => {
                    var queryData = doc.data();
                    var queryEntry = document.createElement('div');
                    queryEntry.classList.add('application');
                    queryEntry.innerHTML = `
                        <h3 onclick="toggleDetails(this)"><br>
                            ${queryData.userName}'s Query
                            <span class="toggle-arrow">&#9660;</span>
                        </h3>
                        <div class="details" style="display: none;">
                            <p><strong>Email:</strong> ${queryData.userEmail}</p>
                            <p><strong>Query:</strong> ${queryData.userQuery}</p>
                            <p><strong>Timestamp:</strong> ${queryData.timestamp ? new Date(queryData.timestamp.toMillis()).toLocaleString() : 'N/A'}</p>
                            <!-- Add other details as needed -->
                        </div>
                    `;

                    queryList.appendChild(queryEntry);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching user queries: ", error);
        });
}



// Toggle details visibility
function toggleDetails(element) {
    var details = element.nextElementSibling;
    var arrow = element.querySelector('.toggle-arrow');

    if (details.style.display === 'block') {
        details.style.display = 'none';
        arrow.classList.remove('rotate-down');
    } else {
        details.style.display = 'block';
        arrow.classList.add('rotate-down');
    }
}

hideAllData();
fetchSalonData();
fetchFreelancerData();
fetchQuestionData();


// Function to handle approving a salon
function approveSalon(salonId) {
    const confirmation = window.confirm('Are you sure you want to approve this salon application?');
    if (!confirmation) {
        return; // If the user cancels, exit the function
    }

    const salonRef = db.collection('salons').doc(salonId);
    salonRef.get()
        .then((doc) => {
            if (doc.exists) {
                const salonData = doc.data();

                // Add the approved salon to the "approved" collection with the same ID
                db.collection('approved').doc(salonId).set(salonData)
                    .then(() => {
                        console.log('Salon approved and added to "approved" collection');

                        // Remove the salon from the "salons" collection after approval
                        salonRef.delete()
                            .then(() => {
                                console.log('Salon removed from "salons" collection');

                                // Update the UI or fetch salon data again to reflect changes
                                fetchSalonData();
                            })
                            .catch((error) => {
                                console.error('Error removing salon:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error adding salon to "approved" collection:', error);
                    });
            } else {
                console.log('No such salon document!');
            }
        })
        .catch((error) => {
            console.error('Error getting salon document:', error);
        });
}

// Function to handle declining a salon
function declineSalon(salonId) {
    const confirmation = window.confirm('Are you sure you want to decline this salon application?');
    if (!confirmation) {
        return; // If the user cancels, exit the function
    }

    const salonRef = db.collection('salons').doc(salonId);
    salonRef.get()
        .then((doc) => {
            if (doc.exists) {
                const salonData = doc.data();

                // Add the declined salon to the "declined" collection with the same ID
                db.collection('declined').doc(salonId).set(salonData)
                    .then(() => {
                        console.log('Salon declined and added to "declined" collection');

                        // Remove the salon from the "salons" collection after decline
                        salonRef.delete()
                            .then(() => {
                                console.log('Salon removed from "salons" collection');

                                // Update the UI or fetch salon data again to reflect changes
                                fetchSalonData();
                            })
                            .catch((error) => {
                                console.error('Error removing salon:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error adding salon to "declined" collection:', error);
                    });
            } else {
                console.log('No such salon document!');
            }
        })
        .catch((error) => {
            console.error('Error getting salon document:', error);
        });
}

function approveFreelancer(freelancerId) {
const confirmation = window.confirm('Are you sure you want to approve this freelancer application?');
if (!confirmation) {
return; // If the user cancels, exit the function
}

const freelancerRef = db.collection('freelancers').doc(freelancerId);
freelancerRef.get()
.then((doc) => {
    if (doc.exists) {
        const freelancerData = doc.data();

        // Add the approved freelancer to the "approved_freelancers" collection with the same ID
        db.collection('approved_freelancers').doc(freelancerId).set(freelancerData)
            .then(() => {
                console.log('Freelancer approved and added to "approved_freelancers" collection');

                // Remove the freelancer from the "freelancers" collection after approval
                freelancerRef.delete()
                    .then(() => {
                        console.log('Freelancer removed from "freelancers" collection');

                        // Update the UI or fetch freelancer data again to reflect changes
                        fetchFreelancerData();
                    })
                    .catch((error) => {
                        console.error('Error removing freelancer:', error);
                    });
            })
            .catch((error) => {
                console.error('Error adding freelancer to "approved_freelancers" collection:', error);
            });
    } else {
        console.log('No such freelancer document!');
    }
})
.catch((error) => {
    console.error('Error getting freelancer document:', error);
});
}


function declineFreelancer(freelancerId) {
const confirmation = window.confirm('Are you sure you want to decline this freelancer application?');
if (!confirmation) {
return; // If the user cancels, exit the function
}

const freelancerRef = db.collection('freelancers').doc(freelancerId);
freelancerRef.get()
.then((doc) => {
    if (doc.exists) {
        const freelancerData = doc.data();

        // Add the declined freelancer to the "declined_freelancers" collection with the same ID
        db.collection('declined_freelancers').doc(freelancerId).set(freelancerData)
            .then(() => {
                console.log('Freelancer declined and added to "declined_freelancers" collection');

                // Remove the freelancer from the "freelancers" collection after decline
                freelancerRef.delete()
                    .then(() => {
                        console.log('Freelancer removed from "freelancers" collection');

                        // Update the UI or fetch freelancer data again to reflect changes
                        fetchFreelancerData();
                    })
                    .catch((error) => {
                        console.error('Error removing freelancer:', error);
                    });
            })
            .catch((error) => {
                console.error('Error adding freelancer to "declined_freelancers" collection:', error);
            });
    } else {
        console.log('No such freelancer document!');
    }
})
.catch((error) => {
    console.error('Error getting freelancer document:', error);
});
}

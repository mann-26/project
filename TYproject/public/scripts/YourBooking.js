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

var currentUser;

// Check user authentication state
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        currentUser = user;
        displayBookingStatus(currentUser.uid);
    } else {
        // // User is signed out
        // console.log('User is signed out.');
        // window.location.href = 'index.html'; // Redirect to login page
    }
});

// Function to display booking status
async function displayBookingStatus(userId) {
    document.getElementById('loadingSpinner').style.display = 'block';
    // Reference to the "Salon_bookings" collection
    var salonBookingsRef = db.collection('Salon_bookings').where('userId', '==', userId);

    // Reference to the "Approved_bookings" collection
    var approvedBookingsRef = db.collection('Approved_bookings').where('userId', '==', userId);

    // Reference to the "Booking_Completed" collection
    var completedBookingsRef = db.collection('Booking_Completed').where('userId', '==', userId);

    // Reference to the "Declined_bookings" collection
    var declinedBookingsRef = db.collection('Declined_bookings').where('userId', '==', userId);

    // Reference to the "Freelancer_bookings" collection
    var freelancerBookingsRef = db.collection('Freelancer_bookings').where('userId', '==', userId);

    // Reference to the "Freelancer_Approved_bookings" collection
    var freelancerApprovedBookingsRef = db.collection('Freelancer_Approved_bookings').where('userId', '==', userId);

    // Reference to the "Freelancer_Booking_Completed" collection
    var freelancerCompletedBookingsRef = db.collection('Freelancer_Booking_Completed').where('userId', '==', userId);

    // Fetch bookings from each collection
    var hasBookings = false;

    await salonBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Pending" bookings for salon
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Salon');
            });
            hasBookings = true;
        }
    });

    await approvedBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Approved" bookings for salon
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Salon');
            });
            hasBookings = true;
        }
    });

    await completedBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Complete" bookings for salon
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Salon');
            });
            hasBookings = true;
        }
    });

    await declinedBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Declined" bookings for salon
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Salon');
            });
            hasBookings = true;
        }
    });

    await freelancerBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Pending" bookings for freelancer
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Freelancer');
            });
            hasBookings = true;
        }
    });

    await freelancerApprovedBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Approved" bookings for freelancer
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Freelancer');
            });
            hasBookings = true;
        }
    });

    await freelancerCompletedBookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            // Display "Complete" bookings for freelancer
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, 'Freelancer');
            });
            hasBookings = true;
        }
    });

    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('customerDashboard').innerHTML = '<p style="font-size: 45px; font-weight: bold; color: black;">Your Booking</p>' + document.getElementById('customerDashboard').innerHTML;

    // Display "No Bookings" if there are no bookings
    if (!hasBookings) {
        document.getElementById('bookingStatus').innerHTML += '<p>No Bookings</p>';
    }  
}

async function displayBookingInfo(doc, type) {
    var bookingData = doc.data();
    // Fetch salon/freelancer name and profile picture based on salonId/freelancerId
    var id = type === 'Salon' ? bookingData.salonId : bookingData.freelancerId;
    var data = await getData(type, id);

    var starsHtml = '';
    var commentSection = '';

    // Check if the booking status is 'Completed' before displaying review section
    if (getStatusLabel(doc.ref.parent.id) === 'Completed') {
        // Display stars and comment section only for completed bookings
        starsHtml = getStarsHtml(bookingData.rating, doc.id, type);
        commentSection = `
        <div class="comment-section">
            <textarea id="commentInput_${type}_${doc.id}" placeholder="Enter your comments..."></textarea>
            <button onclick="submitReview('${doc.id}', '${type}', '${id}')">Submit Review</button>
        </div>`;
    }

    // Display reviews
    const reviews = await fetchReviews(type, id);
    const reviewsHtml = reviews.map(review => {
        return `<div class="review">
                    <p>${review.comment}</p>
                    <p>Rating: ${review.rating}</p>
                </div>`;
    }).join('');

    // Add the reviewsHtml to the right-section
    var bookingHtml = `
        <div class="booking-entry" id="${type}_${doc.id}">
            <div class="left-section">
                <img src="${type === 'Salon' ? data.salonDpImage : data.freelancerDpImage}" alt="${type} Profile Picture">
                <p>${type}: ${type === 'Salon' ? data.salonName : data.freelancerName}</p>
            </div>
            <div class="right-section">
                <p>Date: ${bookingData.appointmentDate}</p>
                <p>Time: ${bookingData.appointmentTime}</p>
                <p>Services: ${bookingData.selectedServices}</p>
                <p>Total Amount: ${bookingData.totalAmount}</p>
                <p>Status: ${getStatusLabel(doc.ref.parent.id)}</p>
                ${starsHtml}
                ${commentSection}
                <div class="reviews-section">
                    ${reviewsHtml}
                </div>
            </div>
        </div>
    `;

    document.getElementById('bookingStatus').innerHTML += bookingHtml;
}


//implement this function properly later 
async function fetchReviews(bookingId, type) {
    const reviewCollection = type === 'Salon' ? 'review_salon' : 'review_freelancer';
    const reviewsRef = db.collection(reviewCollection).doc(bookingId).collection('reviews');

    const reviewsSnapshot = await reviewsRef.get();

    return reviewsSnapshot.docs.map(doc => doc.data());
}


function getStarsHtml(rating, bookingId, type) {
    // You can customize this based on your rating scale
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    let starsHtml = '<div class="star-rating">';
    for (let i = 0; i < maxStars; i++) {
        if (i < fullStars) {
            starsHtml += '<i class="fas fa-star selected"></i>'; // Full star for selected
        } else if (i === fullStars && halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt selected"></i>'; // Half star for selected
        } else {
            // Include bookingId and type in the onclick attribute
            starsHtml += `<i class="fas fa-star" onclick="selectStar(${i + 1}, '${bookingId}', '${type}', this)"></i>`;
        }
    }
    starsHtml += '</div>';

    return starsHtml;
}

function selectStar(selectedStars, bookingId, type, clickedStar) {
    const bookingEntryId = `${type}_${bookingId}`;
    const bookingEntry = document.getElementById(bookingEntryId);
    const stars = bookingEntry.querySelectorAll('.star-rating i');

    // Loop through all stars and toggle the selected class based on the position of the clicked star
    stars.forEach((star, index) => {
        if (star === clickedStar || index < selectedStars) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });

    // Implement your logic to handle star selection
    // You can use the selectedStars, bookingId, and type parameters to update the rating in the database
    console.log(`User selected ${selectedStars} stars for ${type} booking with ID: ${bookingId}`);
    // Update the rating in the database or perform any other actions
}


async function submitReview(bookingId, type, salonOrFreelancerId) {
    // Retrieve the comment from the textarea
    const commentInputId = `commentInput_${type}_${bookingId}`;
    const comment = document.getElementById(commentInputId).value;

    // Validate if a comment is provided
    if (!comment.trim()) {
        alert('Please enter your comments before submitting the review.');
        return;
    }

    // Get the rating from the selected stars
    const bookingEntryId = `${type}_${bookingId}`;
    const selectedStars = getSelectedStars(bookingEntryId);

    // Fetch the services from the appropriate collection based on the type
    const servicesCollection = type === 'Salon' ? 'Booking_Completed' : 'Freelancer_Booking_Completed';
    const servicesRef = db.collection(servicesCollection).doc(bookingId);
    const servicesSnapshot = await servicesRef.get();

    // Extract services from the snapshot
    const servicesData = servicesSnapshot.exists ? servicesSnapshot.data().selectedServices : 'Unknown';

    // Update the review in the appropriate subcollection
    const reviewCollection = type === 'Salon' ? 'review_salon' : 'review_freelancer';
    const reviewData = {
        userId: currentUser.uid,
        comment: comment,
        rating: selectedStars,
        bookingId: bookingId,
        services: servicesData, // Include services in the review data
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // If type is Salon, store salon ID
    if (type === 'Salon') {
        reviewData.salonId = salonOrFreelancerId;
    }

    // If type is Freelancer, store freelancer ID
    if (type === 'Freelancer') {
        reviewData.freelancerId = salonOrFreelancerId;
    }

    // Add the review to the reviews subcollection within the appropriate collection
    await db.collection(reviewCollection).doc(salonOrFreelancerId).collection('reviews').add(reviewData);

    // After submitting the review, you might want to update the UI or take further actions
    console.log(`Review submitted for ${type} booking with ID: ${bookingId}, Comment: ${comment}, Services: ${servicesData}`);

    // You can add further logic here, such as updating the UI or displaying a success message
}




function getSelectedStars(bookingEntryId) {
    const stars = document.querySelectorAll(`#${bookingEntryId} .star-rating i.selected`);
    return stars.length;
}

// Function to fetch salon/freelancer data
function getData(type, id) {
    var ref = type === 'Salon' ? db.collection('approved').doc(id) : db.collection('approved_freelancers').doc(id);
    
    return ref.get().then(doc => {
        if (doc.exists) {
            return doc.data();
        } else {
            return { name: 'Unknown', dpImage: '' };
        }
    }).catch(error => {
        console.error(`Error fetching ${type} data:`, error);
        return { name: 'Unknown', dpImage: '' };
    });
}

// Function to get the status label based on the collection name
function getStatusLabel(collectionName) {
    switch (collectionName) {
        case 'Salon_bookings':
        case 'Freelancer_bookings':
            return 'Pending';
        case 'Approved_bookings':
        case 'Freelancer_Approved_bookings':
            return 'Approved';
        case 'Booking_Completed':
        case 'Freelancer_Booking_Completed':
            return 'Completed';
        case 'Declined_bookings':
            return 'Declined';
        default:
            return 'Unknown';
    }
}

function filterBookings() {
    var statusFilter = document.getElementById('statusFilter').value;
    clearBookingStatus(); // Clear previous bookings

    // Fetch and display bookings based on the selected status
    switch (statusFilter) {
        case 'pending':
            fetchAndDisplayBookings('Salon_bookings', currentUser);
            fetchAndDisplayBookings('Freelancer_bookings', currentUser);
            break;
        case 'approved':
            fetchAndDisplayBookings('Approved_bookings', currentUser);
            fetchAndDisplayBookings('Freelancer_Approved_bookings', currentUser);
            break;
        case 'completed':
            fetchAndDisplayBookings('Booking_Completed', currentUser);
            fetchAndDisplayBookings('Freelancer_Booking_Completed', currentUser);
            break;
        case 'declined':
            fetchAndDisplayBookings('Declined_bookings', currentUser);
            break;
        case 'all':
            fetchAndDisplayAllBookings(currentUser); // New function for displaying all bookings
            break;
        default:
            // Display all bookings
            fetchAndDisplayAllBookings(currentUser);
    }
}

// Function to clear booking status
function clearBookingStatus() {
    document.getElementById('bookingStatus').innerHTML = '';
}

function fetchAndDisplayBookings(collectionName, user) {
    var bookingsRef = db.collection(collectionName).where('userId', '==', user.uid);

    bookingsRef.get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                displayBookingInfo(doc, collectionName.includes('Freelancer') ? 'Freelancer' : 'Salon');
            });
        } else {
            document.getElementById('bookingStatus').innerHTML = '<p>No bookings found.</p>';
        }
    });
}

// Function to fetch and display all bookings
function fetchAndDisplayAllBookings(user) {
    fetchAndDisplayBookings('Salon_bookings', user);
    fetchAndDisplayBookings('Approved_bookings', user);
    fetchAndDisplayBookings('Booking_Completed', user);
    fetchAndDisplayBookings('Declined_bookings', user);

    fetchAndDisplayBookings('Freelancer_bookings', user);
    fetchAndDisplayBookings('Freelancer_Approved_bookings', user);
    fetchAndDisplayBookings('Freelancer_Booking_Completed', user);
}

// // Function to handle logout
// function logout() {
//     firebase.auth().signOut().then(() => {
//         console.log('User signed out.');
//     }).catch(error => {
//         console.error('Error signing out:', error);
//     });
// }

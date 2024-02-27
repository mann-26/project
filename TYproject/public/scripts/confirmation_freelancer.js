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

// Reference to the Firestore database
const db = firebase.firestore();

// Retrieve query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('bookingId');

// Reference to the Firestore collection
const bookingsCollection = db.collection('Freelancer_bookings');

// Retrieve data based on the Booking ID
bookingsCollection.doc(bookingId).get().then((doc) => {
    if (doc.exists) {
        const data = doc.data();

        // Update the HTML elements with the booking details
        var bookingDetailsContainer = document.getElementById('bookingDetailsContainer');
        bookingDetailsContainer.innerHTML = `
            
            <div class="left-section">
            <div class="booking-detail">
            <span><strong>Full Name:</strong></span>
                <div class = "space">
                <span>${data.fullName}</span>
                </div>
            </div>
            <div class="booking-detail">
                <span><strong>Email:</strong></span>
                <div class = "space">
                <span>${data.email}</span>
                </div>
            </div>
            <div class="booking-detail">
                <span><strong>Phone Number:</strong></span>
                <div class = "space">
                <span>${data.phoneNumber}</span>
                </div>
            </div>
            <div class="booking-detail">
                <span><strong>Appointment Date:</strong></span>
                <div class = "space">
                <span>${data.appointmentDate}</span>
                </div>
            </div>
            <div class="booking-detail">
                <span><strong>Appointment Time:</strong></span>
                <div class = "space">
                <span>${data.appointmentTime}</span>
                </div>
            </div>
            <div class="booking-detail">
                <span><strong>Total Amount:</strong></span>
                <div class = "space">
                <span>Rs ${data.totalAmount}</span>
                </div>
            </div>
            </div>

            <div class="right-section">
                <!-- Add your text or content for the right section here -->
                <p><b>You will receive confirmation email shortly</b></p>
                <a href="https://www.gmail.com" target="_blank">
                <img class="email-logo" src="/assets/images/email_logo.png" alt="Email Icon">
                <p class = "gmail"><b>Click above to open Gmail</b></p>
            </div>
        `;

        var animationContainer = document.getElementById('animationContainer');
        var animation = lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'https://lottie.host/fdb6fab1-1da7-4911-8d4e-204542ef3bdc/Hrlrv56m6A.json',
            scale: 0.5
        });
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
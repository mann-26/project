// Initialize Firebase with your project config
var firebaseConfig = {
    apiKey: "AIzaSyBj1haaSvpv6SHe8PwX5wazT56DahPOKQQ",
    authDomain: "snaplooks-bd932.firebaseapp.com",
    databaseURL: "https://snaplooks-bd932-default-rtdb.firebaseio.com",
    projectId: "snaplooks-bd932",
    storageBucket: "snaplooks-bd932.appspot.com",
    messagingSenderId: "680311673132",
    appId: "1:680311673132:web:5d55f0b0fe817b8ac39c89"
};
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Firebase Auth and Firestore
    const auth = firebase.auth();
    const firestore = firebase.firestore();

   // Update the code inside the auth.onAuthStateChanged function
    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, fetch user details from Firestore using UID
            const uid = user.uid;
            const userRef = firestore.collection('users').doc(uid);

            userRef.get().then((doc) => {
                if (doc.exists) {
                    // Document exists, retrieve user data
                    const userData = doc.data();
                    const userEmail = userData.email;
                    const userDisplayName = userData.displayName;
                    const userPhoneNumber = userData.contactNumber;

                    // Set the fetched user details in the form fields
                    document.getElementById('fullName').innerText = userDisplayName || '';
                    document.getElementById('email').innerText = userEmail || '';
                    document.getElementById('phoneNumber').innerText = userPhoneNumber || '';
                } else {
                    console.log('No such document!');
                }
            }).catch((error) => {
                console.log('Error getting document:', error);
            });

            // Fetch salon operating hours and display them
            const salonId = urlParams.get('salonId');
            const salonRef = firestore.collection('approved').doc(salonId);

            salonRef.get().then((doc) => {
                if (doc.exists) {
                    const salonData = doc.data();
                    const openTime24Hour = salonData.openTime;
                    const closeTime24Hour = salonData.closeTime;
                    const salonName = salonData.salonName;

                    // Convert opening and closing times to AM/PM format
                    const openTime12Hour = convertTo12HourFormat(openTime24Hour);
                    const closeTime12Hour = convertTo12HourFormat(closeTime24Hour);

                    // Display salon hours in AM/PM format
                    document.getElementById('salonHours').innerText = `${openTime12Hour} - ${closeTime12Hour}`;
                    document.getElementById('salonName').innerText = `${salonName}`;
                } else {
                    console.log('No such document!');
                }
            }).catch((error) => {
                console.log('Error getting document:', error);
            });
        } else {
            // No user is signed in, handle accordingly
            console.log('No user signed in');
        }
    });

    // Function to convert 24-hour time to AM/PM format
    function convertTo12HourFormat(time24Hour) {
        const splitTime = time24Hour.split(':');
        let hours = parseInt(splitTime[0]);
        const minutes = splitTime[1];

        // Determine AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (00:00)

        return `${hours}:${minutes} ${period}`;
    }



    // Retrieve query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedServices = urlParams.get('services');
    const totalAmount = urlParams.get('total');

    // Display the selected services and total amount in the input fields
    document.getElementById('selectedServices').innerText = selectedServices;
    document.getElementById('totalAmount').innerText = totalAmount;

    document.getElementById('appointmentDate').addEventListener('input', function () {
            updateValidationMessage();
        });

        document.getElementById('appointmentTime').addEventListener('input', function () {
            updateValidationMessage();
        });
        
        function updateValidationMessage() {
            var appointmentDate = document.getElementById('appointmentDate').value;
            var appointmentTime = document.getElementById('appointmentTime').value;
            var validationMessage = document.getElementById('validationMessage');
        
            if (appointmentDate && appointmentTime) {
                // Parse the selected time
                var selectedTime = new Date("2000-01-01 " + appointmentTime);
        
                // Query the database to get salon operating hours based on salonId
                const salonId = urlParams.get('salonId');
                const salonRef = firestore.collection('approved').doc(salonId);
        
                salonRef.get().then((doc) => {
                    if (doc.exists) {
                        // Document exists, retrieve salon data
                        const salonData = doc.data();
                        const openingTime = new Date("2000-01-01 " + salonData.openTime);
                        const closingTime = new Date("2000-01-01 " + salonData.closeTime);
        
                        // Check if the selected time is within the salon's working hours
                        if (selectedTime >= openingTime && selectedTime <= closingTime) {
                            validationMessage.innerText = ''; // Clear the validation message
                        } else {
                            validationMessage.innerText = 'The selected time is outside salon hours. Select other time';
                            return; // Do not proceed with booking if validation fails
                        }
                    } else {
                        console.log('No such document!');
                    }
                }).catch((error) => {
                    console.log('Error getting document:', error);
                });
            }
        }
        
    // Handle form submission
    var bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form data
        var fullName = document.getElementById('fullName').innerText;
        var email = document.getElementById('email').innerText;
        var phoneNumber = document.getElementById('phoneNumber').innerText;
        var appointmentDate = document.getElementById('appointmentDate').value;
        var appointmentTime = document.getElementById('appointmentTime').value;

        var validationMessage = document.getElementById('validationMessage');

        if (!appointmentDate || !appointmentTime) {
            validationMessage.innerText = 'Please select both date and time before booking.';
            return;
        }

        // Retrieve salon ID from URL parameters
        const salonId = urlParams.get('salonId');

        // Get the currently signed-in user
        const user = firebase.auth().currentUser;

        if (user) {
            // User is signed in, get the user ID (UID)
            const userId = user.uid;

            // Parse the selected time
            var selectedTime = new Date("2000-01-01 " + appointmentTime);

            // Query the database to get salon operating hours based on salonId
            const salonRef = firestore.collection('approved').doc(salonId);

            salonRef.get().then((doc) => {
                if (doc.exists) {
                    // Document exists, retrieve salon data
                    const salonData = doc.data();
                    const openingTime = new Date("2000-01-01 " + salonData.openTime);
                    const closingTime = new Date("2000-01-01 " + salonData.closeTime);

                    // Check if the selected time is within the salon's working hours
                    if (selectedTime >= openingTime && selectedTime <= closingTime) {
                        validationMessage.innerText = ''; // Clear the validation message

                        // Save booking details to Firestore
                        firestore.collection('Salon_bookings').add({
                            userId: userId,
                            salonId: salonId,
                            fullName: fullName,
                            email: email,
                            phoneNumber: phoneNumber,
                            appointmentDate: appointmentDate,
                            appointmentTime: appointmentTime,
                            selectedServices: selectedServices,
                            totalAmount: totalAmount,
                        }).then(function (docRef) {
                            console.log('Booking added with ID: ', docRef.id);

                            // After saving, send email to the user
                            const userEmail = email;
                            const emailData = { userEmail, services: selectedServices, totalAmount };

                            fetch('/sendEmail', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(emailData),
                            }).then(response => response.json())
                                .then(data => {
                                    console.log('Email sent:', data);
                                    // Optionally, you can redirect the user to a confirmation page after the email is sent
                                    // window.location.href = 'confirmation.html';
                                }).catch(error => {
                                    console.error('Error sending email:', error);
                                });

                            // Redirect to a confirmation page
                            const bookingId = docRef.id;
                            window.location.href = `confirmation.html?bookingId=${bookingId}`;
                        }).catch(function (error) {
                            console.error('Error adding booking: ', error);
                        });
                    } else {
                        validationMessage.innerText = 'The selected time is outside salon hours. Select other time';
                    }
                } else {
                    console.log('No such document!');
                }
            }).catch((error) => {
                console.log('Error getting document:', error);
            });
        } else {
            // Handle the case where no user is signed in
            console.log('No user signed in');
        }
    });

    flatpickr("#appointmentDate", {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: new Date().fp_incr(60), // 60 days from today
    });

    flatpickr("#appointmentTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        minTime: "now",
    });
});
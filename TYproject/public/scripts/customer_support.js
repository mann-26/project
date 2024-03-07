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

// Function to handle form submission
function submitQuery(event) {
    event.preventDefault();
  
    // Show the loading spinner
    var spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';
  
    var userName = document.getElementById('userName').value;
    var userEmail = document.getElementById('userEmail').value;
    var userQuery = document.getElementById('userQuery').value;
  
    // Add the user query to the "user_queries" collection
    db.collection('user_queries').add({
        userName: userName,
        userEmail: userEmail,
        userQuery: userQuery,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
        console.log('Query submitted with ID: ', docRef.id);
        // Hide the loading spinner
        spinner.style.display = 'none';
        // Show the success pop-up or perform other actions
        showPopup();
    })
    .catch(function(error) {
        console.error('Error submitting query: ', error);
        // Hide the loading spinner
        spinner.style.display = 'none';
        alert('Error submitting query. Please try again.');
    });
  }
function showPopup() {
    var popup = document.getElementById('successPopup');
    popup.style.display = 'block';
  }
  
  function closePopup() {
    var popup = document.getElementById('successPopup');
    popup.style.display = 'none';
  }
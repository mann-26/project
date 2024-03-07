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

// Get a reference to the Firestore database
const db = firebase.firestore();

function submitQuestion() {
    const questionInput = document.getElementById('questionInput').value.trim();

    // Simple validation: Check if the question is not empty
    if (questionInput === '') {
        openValidationModal();
        return; // Stop the function if validation fails
    }

    openPleaseWaitModal();

    // Save the question to Firestore
    saveQuestionToFirestore(questionInput);
}

function saveQuestionToFirestore(question) {
    db.collection('question_asked').add({
        question: question,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // Firestore operation successful, close the "Please Wait" modal
        closePleaseWaitModal();

        // Show the success modal
        openModal();
    })
    .catch(error => {
        console.error('Error adding document: ', error);
        // Handle error if needed
        closePleaseWaitModal();
    });
}
function openPleaseWaitModal() {
        const pleaseWaitModal = document.getElementById('pleaseWaitModal');
        pleaseWaitModal.style.display = 'block';
    }

    function closePleaseWaitModal() {
        const pleaseWaitModal = document.getElementById('pleaseWaitModal');
        pleaseWaitModal.style.display = 'none';
    }

function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function openValidationModal() {
    const validationModal = document.getElementById('validationModal');
    validationModal.style.display = 'block';
}

function closeValidationModal() {
    const validationModal = document.getElementById('validationModal');
    validationModal.style.display = 'none';
}

function goToHome() {
    // Redirect to home.html
    window.location.href = 'home.html';
}
var firebaseConfig = {
    apiKey: "AIzaSyBj1haaSvpv6SHe8PwX5wazT56DahPOKQQ",
    authDomain: "snaplooks-bd932.firebaseapp.com",
    databaseURL: "https://snaplooks-bd932-default-rtdb.firebaseio.com/",
    projectId: "snaplooks-bd932",
    storageBucket: "snaplooks-bd932.appspot.com",
    messagingSenderId: "680311673132",
    appId: "1:680311673132:web:5d55f0b0fe817b8ac39c89"
    };

    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    var storage = firebase.storage();

function addCustomService() {
    var customServicesContainer = document.getElementById('customServicesContainer');

    var serviceDiv = document.createElement('div');
    serviceDiv.classList.add('form-group', 'service-container');

    var serviceNameInput = document.createElement('input');
    serviceNameInput.type = 'text';
    serviceNameInput.classList.add('form-control', 'service-name');
    serviceNameInput.placeholder = 'Service Name';
    serviceDiv.appendChild(serviceNameInput);

    var serviceDescriptionInput = document.createElement('textarea');
    serviceDescriptionInput.classList.add('form-control', 'service-description');
    serviceDescriptionInput.placeholder = 'Service Description';
    serviceDiv.appendChild(serviceDescriptionInput);

    var servicePriceInput = document.createElement('input');
    servicePriceInput.type = 'text';
    servicePriceInput.classList.add('form-control', 'service-price');
    servicePriceInput.placeholder = 'Service Price';
    serviceDiv.appendChild(servicePriceInput);

    var serviceImageInput = document.createElement('input');
    serviceImageInput.type = 'file';
    serviceImageInput.accept = 'image/*';
    serviceImageInput.classList.add('service-image');
    serviceDiv.appendChild(serviceImageInput);

    serviceImageInput.addEventListener('change', function () {
        handleCustomServiceImageUpload(serviceImageInput);
    });

    customServicesContainer.appendChild(serviceDiv);
}
    function redirectTofreelancerDashboard() {
            // Assuming the dashboard is named 'freelancer_dashboard.html'
            window.location.href = 'freelancer_dashboard.html';
        }

        function uploadPhoto() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; 

        fileInput.click();

        fileInput.addEventListener('change', function () {
            var file = fileInput.files[0];

            if (file) {
                var freelancerDpImage = document.getElementById('freelancerDpImage');

                var reader = new FileReader();
                reader.onload = function (e) {
                    freelancerDpImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    // Your existing JavaScript code...
    async function handleCustomServiceImageUpload(inputElement) {
    var file = inputElement.files[0];

    if (file) {
        // Get a reference to the Firebase Storage location
        var storageRef = storage.ref();

        // Generate a unique filename for the image
        var filename = 'custom_services/' + Date.now() + '_' + file.name;

        // Upload the file to Firebase Storage
        var fileRef = storageRef.child(filename);
        await fileRef.put(file);

        // Get the download URL of the uploaded image
        var downloadURL = await fileRef.getDownloadURL();

        // Find the parent container of the current input element
        var serviceContainer = inputElement.closest('.service-container');

        // Add a hidden input field to store the download URL
        var downloadURLInput = document.createElement('input');
        downloadURLInput.type = 'hidden';
        downloadURLInput.value = downloadURL;
        downloadURLInput.name = 'service-image-url'; // Change this to an appropriate name
        serviceContainer.appendChild(downloadURLInput);
    }
}

    function handleAuthStateChange() {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in, you can proceed to savefreelancerToFirestore or update UI
                    console.log("User is authenticated");
                    fetchfreelancerDataForLoggedInUser(user.uid);
                } else {
                    // User is signed out, handle accordingly
                    console.error("User not authenticated.");
                    // Optionally, display a message or handle the scenario where the user is not authenticated
                }
            });
        }

    // Function to add new service inputs
    
    async function savefreelancerToFirestore() {
    var user = firebase.auth().currentUser;

    if (user) {
        var userID = user.uid;

        // Get coordinates
        var { latitude, longitude } = await getCurrentLocation();

        // Get values from the form
        var freelancerName = document.getElementById('freelancerName').value;
        var contact = document.getElementById('contact').value;
        var openTime = document.getElementById('openTime').value;
        var closeTime = document.getElementById('closeTime').value;
        var areaName = document.getElementById('areaName').value;

        // Get working days
        var workingDays = [];
        var checkboxes = document.getElementsByName('workingDays');
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                workingDays.push(checkbox.value);
            }
        });

        // Get freelancerDP image
        var freelancerDpImage = document.getElementById('freelancerDpImage');
        var freelancerDpImageFile = await getBase64Image(freelancerDpImage);

        // Get selected services
        var selectedServices = [];
        var serviceElements = document.querySelectorAll('.service-container');

        // Process all service elements asynchronously
        await Promise.all(Array.from(serviceElements).map(async function (serviceElement, index) {
            var serviceName = serviceElement.querySelector('.service-name').value;
            var serviceDescription = serviceElement.querySelector('.service-description').value;
            var servicePrice = serviceElement.querySelector('.service-price').value;
            var serviceImage = serviceElement.querySelector('.service-image').files[0];
            var downloadURLInput = serviceElement.querySelector('input[name="service-image-url"]');
            var serviceImageURL = downloadURLInput ? downloadURLInput.value : '';

            // You can add validation for required fields

            try {
                // Convert service image to base64 with the specified format
                var base64Image = await getBase64Image(serviceImage);

                // Add the service details to the selectedServices array
                selectedServices.push({
                    name: serviceName,
                    description: serviceDescription,
                    price: servicePrice,
                    image: serviceImageURL || base64Image, // Use base64 image if URL is empty
                });

                console.log(`Service ${index} processed successfully.`);
            } catch (error) {
                console.error(`Error processing service ${index}:`, error);
            }
        }));

        // Prepare freelancer data for Firestore
        var freelancerData = {
            freelancerName: freelancerName,
            contact: contact,
            openTime: openTime,
            closeTime: closeTime,
            areaName: areaName,
            workingDays: workingDays,
            freelancerDpImage: freelancerDpImageFile, // Save freelancerDP image with the specified format
            selectedServices: selectedServices, // Include selected services as an array
            coordinates: {
                latitude: latitude,
                longitude: longitude
            }
            // Add other fields as needed
        };

        // Save freelancer data to Firestore
        db.collection('freelancers').doc(userID).set(freelancerData)
            .then(function () {
                // Index services by updating the "services" collection
                updateServicesCollection(selectedServices, userID);
                
                var successMessageContainer = document.getElementById('successMessage');
                successMessageContainer.innerHTML = '<p>Your freelancer data has been successfully registered!</p>';
            })
            .catch(function (error) {
                console.error('Error adding freelancer information:', error);
                // Optionally, display an error message or handle the error
            });
    } else {
        console.error("User not authenticated.");
        // Optionally, display a message or handle the scenario where the user is not authenticated
    }
}

// Function to update the "services" collection
function updateServicesCollection(selectedServices, userID) {
    selectedServices.forEach(function (service) {
        // Create a document reference using the service name
        var serviceDocRef = db.collection('services').doc(service.name);

        // Update the "freelancers" subcollection within the service document
        serviceDocRef.collection('freelancers').doc(userID).set({
            freelancerID: userID,
            // Add other freelancer-related fields if needed
        }, { merge: true }); // Use merge to update the document without overwriting existing data
    });
}
async function getBase64Image(img) {
    return new Promise(async function (resolve) {
        if (img instanceof HTMLImageElement) {
            // Handle HTMLImageElement (e.g., freelancerDpImage)
            var canvas = document.createElement('canvas');
            var maxWidth = 800; // Adjust the maximum width as needed

            // Set canvas dimensions while maintaining aspect ratio
            var width = img.width;
            var height = img.height;
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, width, height);

            // Compress the image
            var compressedDataURL = await compressImage(canvas.toDataURL('image/jpeg'));

            resolve(compressedDataURL);
        } else if (img instanceof File) {
            // Handle File object (e.g., serviceImage)
            var reader = new FileReader();
            reader.onload = async function (e) {
                var compressedDataURL = await compressImage(e.target.result);
                resolve(compressedDataURL);
            };
            reader.readAsDataURL(img);
        } else {
            console.error('Invalid image object:', img);
            resolve(''); // Return empty string or handle error accordingly
        }
    });
}


  
// Function to compress the image using the browser's built-in image compression
function compressImage(dataURL) {
    return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            var maxWidth = 800; // Adjust the maximum width as needed

            // Set canvas dimensions while maintaining aspect ratio
            var width = img.width;
            var height = img.height;
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, width, height);

            // Resolve with the compressed dataURL
            resolve(canvas.toDataURL('image/jpeg'));
        };

        img.src = dataURL;
    });
}

async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    resolve({ latitude, longitude });
                },
                function (error) {
                    reject(error);
                }
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}


      
function fetchfreelancerDataForLoggedInUser(userId) {
    var freelancerForm = document.getElementById('freelancerForm');
    var freelancerDpImage = document.getElementById('freelancerDpImage');
    var freelancerNameInput = document.getElementById('freelancerName');
    var locationInput = document.getElementById('location');
    var contactInput = document.getElementById('contact');
    
    
    var declineMessageContainer = document.getElementById('declineMessage');

    db.collection('approved').doc(userId).get()
        .then((approvedDoc) => {
            if (approvedDoc.exists) {
                // freelancer is approved
                displayApprovalMessage('Your freelancer is approved. Congratulations!');
            } else {
                db.collection('declined').doc(userId).get()
                    .then((declinedDoc) => {
                        if (declinedDoc.exists) {
                            // freelancer is declined
                            displayDeclineMessage('Your freelancer application has been declined.');
                        } else {
                            // Check if data is present in the freelancers collection
                            db.collection('freelancers').doc(userId).get()
                                .then((freelancerDoc) => {
                                    if (freelancerDoc.exists) {
                                        // freelancer is neither approved nor declined but data is present in the freelancers collection
                                        declineMessageContainer.innerHTML = '<p>Your freelancer is pending approval.</p>';
                                        fetchfreelancerDataFromMainCollection(userId); // Fetch data from the main collection
                                    } else {
                                        // freelancer is neither approved nor declined and no data in the freelancers collection
                                        // No message is displayed in this case
                                        fetchfreelancerDataFromMainCollection(userId); // Fetch data from the main collection
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error checking freelancers collection: ", error);
                                });
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking declined collection: ", error);
                    });
            }
        })
        .catch((error) => {
            console.error("Error checking approved collection: ", error);
        });
}

function fetchfreelancerDataFromMainCollection(userId) {
    var freelancerForm = document.getElementById('freelancerForm');
    var freelancerDpImage = document.getElementById('freelancerDpImage');
    var freelancerNameInput = document.getElementById('freelancerName');
    var locationInput = document.getElementById('location');
    var contactInput = document.getElementById('contact');
    
    

    db.collection('freelancers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                var freelancerData = doc.data();

                // Set freelancer profile image
                if (freelancerData.freelancerDpImage) {
                    freelancerDpImage.src = freelancerData.freelancerDpImage;
                }

                // Set freelancer form fields
                freelancerNameInput.value = freelancerData.freelancerName || '';
                locationInput.value = freelancerData.location || '';
                contactInput.value = freelancerData.contact || '';
            } else {
                console.log('No such freelancer document!');
            }
        })
        .catch((error) => {
            console.error("Error fetching freelancer data: ", error);
        });
}
function registerServicesWithPrices() {
    // Add your code to fetch prices and register them in the database

    var prices = {};
    var selectedServices = document.getElementsByName('services');

    for (var i = 0; i < selectedServices.length; i++) {
        if (selectedServices[i].checked) {
            var serviceName = selectedServices[i].value;
            var inputId = 'price_' + serviceName.replace(/\s+/g, '_').toLowerCase();
            var priceInput = document.getElementById(inputId);
            
            // Fetch and store the prices
            prices[serviceName] = priceInput.value;
        }
    }

    // You can now save the 'prices' object in the database along with other freelancer information
    console.log('Prices:', prices);

    // Close the modal
    var modal = document.getElementById('servicesModal');
    modal.style.display = 'none';
}
function displayApprovalMessage(message) {
    var successMessageContainer = document.getElementById('successMessage');
    successMessageContainer.innerHTML = `<p>${message}</p>`;
}
function displayDeclineMessage(message) {
    var declineMessageContainer = document.getElementById('declineMessage');
    declineMessageContainer.innerHTML = `<p>${message}</p>`;
    // You can customize the decline message display as needed
}
function disablefreelancerForm() {
    var inputs = document.querySelectorAll('#freelancerForm input, #freelancerForm textarea');
    inputs.forEach((input) => {
        input.setAttribute('readonly', true);
    });
}
// Add this code after your existing script
var map;
    var marker;

    function initMap() {
        map = L.map('map').setView([0, 0], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Create a draggable marker
        marker = L.marker([0, 0], {
            draggable: true
        }).addTo(map);

        // Add the following code to register the dragend event listener
        marker.on('dragend', function (e) {
             var locationInput = document.getElementById('location');
             var latlng = e.target.getLatLng();
             locationInput.value = latlng.lat + ', ' + latlng.lng;
        });
    }

// ...

async function getCurrentLocation() {
    console.log('Getting current location...');
    
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async function (position) {
                    try {
                        var latitude = position.coords.latitude;
                        var longitude = position.coords.longitude;

                        // Update the area name input field
                        var areaNameInput = document.getElementById('areaName');
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        areaNameInput.value = data.display_name;

                        // Update the map and marker
                        updateMap(latitude, longitude);

                        resolve({ latitude, longitude });
                    } catch (error) {
                        reject(error);
                    }
                },
                function (error) {
                    // Handle errors
                    showError(error);
                    reject(error);
                }
            );
        } else {
            const errorMessage = "Geolocation is not supported by this browser.";
            console.error(errorMessage);
            showError(errorMessage);
            reject(errorMessage);
        }
    });
}

function storeCoordinatesInDatabase(latitude, longitude) {
    // Modify this part to save the coordinates in your database
    // For example, you can use the Firebase Firestore code you've already implemented
    // Replace 'yourUserId' with the actual user ID or other identifier
    console.log('Storing coordinates in the database:', latitude, longitude);

    var user = firebase.auth().currentUser;
    if (user) {
        var userID = user.uid;

        // Create an object with coordinates subfields
        var coordinatesData = {
            latitude: latitude,
            longitude: longitude
        };

        // Set the 'coordinates' field with the coordinatesData object
        db.collection('freelancers').doc(userID).update({
            coordinates: coordinatesData,
            // Add other fields as needed
        }).then(function () {
            console.log('Coordinates successfully stored in the database!');
        }).catch(function (error) {
            console.error('Error storing coordinates:', error);
            // Optionally, display an error message or handle the error
        });
    } else {
        console.error("User not authenticated.");
        // Optionally, display a message or handle the scenario where the user is not authenticated
    }
}

function updateMap(latitude, longitude) {
    // Set the map view to the new coordinates
    map.setView([latitude, longitude], 13);

    // Set the marker to the new coordinates
    marker.setLatLng([latitude, longitude]);

    // Optionally, you can close the modal if it's open
    var modal = document.getElementById('servicesModal');

    // Check if the modal element exists before trying to access its style
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal element not found.");
        // Handle the scenario where the modal element is not found
    }
}
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // Set the map view to the user's current location
    map.setView([latitude, longitude], 13);

    // Set the marker to the user's current location
    var marker = L.marker([latitude, longitude], {
        draggable: true
    }).addTo(map);

    // Update the location input field
    var locationInput = document.getElementById('location');
    locationInput.value = latitude + ', ' + longitude;

    // Remove existing markers from the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add the new marker to the map
    marker.addTo(map);

    // Optionally, you can close the modal if it's open
    var modal = document.getElementById('servicesModal');
    modal.style.display = 'none';
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


function openServicesModal() {
    var modal = document.getElementById('servicesModal');

    // Dynamically generate content for services and prices
    var selectedServices = document.getElementsByName('services');
    var modalBody = document.querySelector('#servicesModal .modal-body');
    modalBody.innerHTML = '';

    for (var i = 0; i < selectedServices.length; i++) {
        if (selectedServices[i].checked) {
            var serviceName = selectedServices[i].value;
            var inputId = 'price_' + serviceName.replace(/\s+/g, '_').toLowerCase();

            // Add input fields for prices
            modalBody.innerHTML += `
                <div class="form-group">
                    <label for="${inputId}">${serviceName} Price:</label>
                    <input type="text" id="${inputId}" name="${inputId}" class="form-control">
                </div>
            `;
        }
    }

    // Show the modal
    modal.style.display = 'block';
}



    // Your existing event listeners and other JavaScript code remain unchanged.

    document.addEventListener('DOMContentLoaded', function () {
        initMap();
        handleAuthStateChange();
        var registeredEmail = localStorage.getItem('registeredEmail');
        var emailElement = document.getElementById('freelancerEmail');
        if (emailElement) {
            emailElement.textContent = registeredEmail || 'Not Available';
        }
        var modalCloseButton = document.querySelector('#servicesModal .close');
    });
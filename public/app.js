// Get a reference to the database service
var database = firebase.firestore();

// Function to retrieve data from Firebase
function retrieveData() {
    // Reference to the data node
    var dataRef = firebase.database().ref('dataNode');
    
    // Listen for changes
    dataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        displayData(data);
    });
}

// Function to display data on the HTML page
function displayData(data) {
    var dataDiv = document.getElementById('data');
    dataDiv.innerHTML = ''; // Clear existing data
    
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var item = document.createElement('div');
            item.innerText = `${key}: ${data[key]}`;
            dataDiv.appendChild(item);
        }
    }
}

// Call retrieveData to start the process
retrieveData();
console.log("Fetching data...")

descBox = document.getElementById('description');
dirBox = document.getElementById('directions');
locationPath = '';

directions = {
	'W': 'West',
	'E': 'East',
	'N': 'North',
	'S': 'South',
};

reverseDirection = {
	'North': 'N',
	'South': 'S',
	'West': 'W',
	'East': 'E',
};

function generate_stuff(data){
	descBox.innerText = data.description;
	dirBox.innerHTML = "Which way do you want to go?<br><br>";
	locationPath = data.locationPath;
	for (var i = data.exits.length - 1; i >= 0; i--) {
		dirBox.innerHTML += "<button id='" + data.exits[i] + "' onClick='send_data()'>" + directions[data.exits[i]] + "</button>";
	}
}

fetch('https://api.noopschallenge.com/pathbot/start', {
	method: 'POST'
	})
	.then(response => response.json())
		.then(data => {
			console.log(data);
			generate_stuff(data);
		})
	.catch(error => {
		console.error(error);
	})

function send_data() {
	console.log('https://api.noopschallenge.com' + locationPath)
	buttonText = event.target.innerText;
	console.log(buttonText);
	fetch('https://api.noopschallenge.com' + locationPath,
	{
		method: 'POST',
		mode: 'cors',
		headers: {
			// 'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({direction : reverseDirection[buttonText]})
	})
	.then(response => response.json())
		.then(data => {
			console.log(data);
			generate_stuff(data);
		})
	.catch(error => {console.log("Error: " + error)})
}
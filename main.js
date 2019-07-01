let descBox = document.getElementById('description');
let dirBox = document.getElementById('directions');

let locationPath = '';
let validExits = [];

function generate_stuff(data){
	descBox.innerHTML = "<u>Room Description</u><br><br><p>" + data.description + "</p>";
	dirBox.innerHTML = "Which way do you want to go?<br><br>";
	if (data.status == 'in-progress') 
		locationPath = data.locationPath;
		for (var i = data.exits.length - 1; i >= 0; i--) {
			dirBox.innerHTML += "<button id='" + data.exits[i] + "' onClick='send_data_button()'>" + directions[data.exits[i]] + "</button>";
		}
}

function start_app(){
	console.log("Starting game...")
	fetch('https://api.noopschallenge.com/pathbot/start', {
		method: 'POST'
		})
		.then(response => response.json())
			.then(data => {
				console.log(data);
				document.getElementById('start-button').style.display = 'none';
				validExits = data.exits;
				window.addEventListener("keypress", (event) => {
					let keypressed = event.key;
					console.log(keypressed);
					if (['a', 'w', 's', 'd'].includes(keypressed)) 
						send_data_keypress(keypressed);
				});
				generate_stuff(data);
			})
		.catch(error => {
			console.error(error);
		})
}

function send_data_button() {
	let directions = {
		'W': 'West',
		'E': 'East',
		'N': 'North',
		'S': 'South',
	};
	
	let reverseDirection = {
		'North': 'N',
		'South': 'S',
		'West': 'W',
		'East': 'E',
	};

	buttonText = event.target.innerText;
	console.log("Moving " + buttonText);
	fetch_data(reverseDirection[buttonText]);
}

function send_data_keypress(key){
	let keyLegend = {
		'w': 'N',
		'a': 'W',
		'd': 'E',
		's': 'S',
	};
	
	fetch_data(keyLegend[key]);
}

function fetch_data(dirc) {
	if (! validExits.includes(dirc)) 
		return ;
	fetch('https://api.noopschallenge.com' + locationPath,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({direction : dirc})
	})
	.then(response => response.json())
		.then(data => {
			console.log(data);
			validExits = data.exits;
			generate_stuff(data);
		})
	.catch(error => {console.log("Error: " + error)})
}
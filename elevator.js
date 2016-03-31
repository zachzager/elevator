// elevator.js

var elevatorState = 0;
var position;
var problem;
var displayStateNumber = 0;
var stateNumber = 0;
var totalStates = 5;
elevatorStateList = [];
starting_elevator = '';

final_destination = {};
final_destination.floor = 0;
final_destination.time = 0;

solutionList = [];

// Elevator States

elevatorState1 = [['.','.','.','.'],
				 ['.','.','.','.'],
				 ['.','B','.','.'],
				 ['.','.','C','.'],
				 ['A','.','.','D']];

elevatorState2 = [['.','.','.','.'],
				 ['A','B','.','.'],
				 ['.','.','.','.'],
				 ['.','.','.','.'],
				 ['.','.','C','D']];

elevatorState3 = [['A','.','.','.'],
				 ['.','.','.','.'],
				 ['.','.','.','.'],
				 ['.','B','C','.'],
				 ['.','.','.','D']];

elevatorState4 = [['A','.','','.'],
				 ['.','.','C','.'],
				 ['.','B','.','.'],
				 ['.','.','.','.'],
				 ['.','.','.','D']];

elevatorState5 = [['A','.','C','D'],
				 ['.','.','.','.'],
				 ['.','B','.','.'],
				 ['.','.','','.'],
				 ['.','.','.','.']];

// adjacency check
/*
elevatorState1 = [['.','.','.','.'],
				 ['.','.','.','.'],
				 ['.','B','.','.'],
				 ['.','.','C','D'],
				 ['A','.','.','.']];

elevatorState2 = [['.','.','.','.'],
				 ['.','.','.','.'],
				 ['.','.','.','.'],
				 ['A','B','C','.'],
				 ['.','.','.','D']];

elevatorState3 = [['A','.','.','.'],
				 ['.','.','.','.'],
				 ['.','B','.','.'],
				 ['.','.','C','D'],
				 ['.','.','.','.']];

elevatorState4 = [['A','.','','.'],
				 ['.','.','C','.'],
				 ['.','B','.','.'],
				 ['.','.','.','.'],
				 ['.','.','.','D']];

elevatorState5 = [['A','.','C','D'],
				 ['.','.','.','.'],
				 ['.','B','.','.'],
				 ['.','.','','.'],
				 ['.','.','.','.']];
*/

function setup() {

	// get all HTML elements
	form = document.getElementById('file_form');
	setup_form();
	fileSelect = document.getElementById('file_select');
	uploadButton = document.getElementById('upload_button');
	
	problem = document.getElementById("problem");
	solution = document.getElementById("solution");
	start = document.getElementById("start");
	fd_floor = document.getElementById("fd_floor");
	fd_time = document.getElementById("fd_time");

	// retrieve and show elevator states
	getElevatorStates();
	printElevatorState(elevatorStateList[displayStateNumber]);
}

function setup_form() {
	form.onsubmit = function(event) {
		event.preventDefault();

		uploadButton.innerHTML = 'Uploading...'; // Update button text.

		var files = fileSelect.files; // The rest of the code will go here...

		var formData = new FormData();

		// Loop through each of the selected files.
		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			// Check the file type.
			if (!file.type.match('image.*')) {
				continue;
				}

			// Add the file to the request.
			formData.append('photos[]', file, file.name);
		}

		formData.append(name, file, filename); // Files

		formData.append(name, blob, filename); // Blobs

		formData.append(name, value);  // Strings

		var xhr = new XMLHttpRequest(); // Set up the request.

		// Open the connection.
		xhr.open('POST', 'handler.php', true);

		// Set up a handler for when the request finishes.
		xhr.onload = function () {
			if (xhr.status === 200) {
				// File(s) uploaded.
				uploadButton.innerHTML = 'Upload';
			} else {
			alert('An error occurred!');
			}
		};
	}
}

// starts checking through elevator states
function calculate() {

	// sets inputted values
	final_destination.time = Number(fd_time.value);
	final_destination.floor = elevatorStateList[0].length - Number(fd_floor.value);
	starting_elevator = start.value;

	determinePaths(getFirstCoords(),'',0); // starts checking all states/paths

	printSolution(); // displays solution
}

function clearInput() {
	start.value = '';
	fd_floor.value = '';
	fd_time.value = '';
}

// searches through all possible paths to find elevator traversal solution
function determinePaths(curr_coords, path, state, prev_elevator) {

	if (state < totalStates) {

		// check adjacent elevators
		goToRightElevator(curr_coords, path, state, prev_elevator);
		goToLeftElevator(curr_coords, path, state, prev_elevator);

		// stay on current elevator
		path += elevatorStateList[state][curr_coords[0]][curr_coords[1]];
		state += 1;
		determinePaths([getLevel(curr_coords[1],state), curr_coords[1]],path,state,prev_elevator);
		checkForSolution(curr_coords[0],state,path);
	}
}

// go to right elevator [when possible]
function goToRightElevator(curr_coords, path, state, prev_elevator) {
	if (elevatorStateList[state][curr_coords[0]][curr_coords[1]+1] !== '.' &&
		elevatorStateList[state][curr_coords[0]][curr_coords[1]+1] !== '' &&
		typeof elevatorStateList[state][curr_coords[0]][curr_coords[1]+1] !== "undefined" &&
		elevatorStateList[state][curr_coords[0]][curr_coords[1]+1] !== prev_elevator) {
		determinePaths([curr_coords[0], curr_coords[1]+1],path,
						state,elevatorStateList[state][curr_coords[0]][curr_coords[1]]);
	}

}

// go to left elevator [when possible]
function goToLeftElevator(curr_coords, path, state, prev_elevator) {
	if (elevatorStateList[state][curr_coords[0]][curr_coords[1]-1] !== '.' &&
		elevatorStateList[state][curr_coords[0]][curr_coords[1]-1] !== '' &&
		typeof elevatorStateList[state][curr_coords[0]][curr_coords[1]-1] !== "undefined" &&
		elevatorStateList[state][curr_coords[0]][curr_coords[1]-1] !== prev_elevator) {
		determinePaths([curr_coords[0], curr_coords[1]-1],path,
						state,elevatorStateList[state][curr_coords[0]][curr_coords[1]]);
	}
}

// adds elevator strings to the solution list if they are on the specified
// vertical level and the elevators are at the specified state
function checkForSolution(level, state, path) {

	if (level===final_destination.floor && state===final_destination.time) {
		solutionList.push(path);
	}
}

// displays the solution if there is one
function printSolution(){

	solution.innerHTML = "Solution: ";

	if (solutionList.length > 0) {
		solution.innerHTML += solutionList[0];
	}
	solutionList = [];
}


// goes through whole elevator state to find starting elevator
function getFirstCoords() {

	elevatorState = elevatorStateList[0];

	for (x in elevatorState) {
		for (y in elevatorState[x]) {
			if (elevatorState[x][y] === starting_elevator) {
				return [Number(x),Number(y)];
			}
		}
	}
}

// gets coordinates of an elevator at a specified shaft and state
// parameters: "state" - which state you're checking
//			   "next" - indicates whether you're checking for 
//			            the current or next elevator
// returns: level/height of the specified elevator
function getLevel(shaft,state) {

	var elevatorState = elevatorStateList[state];

	for (x in elevatorState) {
		if (elevatorState[x][shaft] !== '.' && elevatorState[x][shaft] !== '') {
			return(Number(x));
		}
	}
}

// responds to user clicking the button to cycle through elevator
function nextState() {

	displayStateNumber++;

	if (displayStateNumber == totalStates) {
		displayStateNumber = 0;
	}

	printElevatorState(elevatorStateList[displayStateNumber]);
}

// responds to user clicking the button to cycle through elevator
function prevState() {

	displayStateNumber--;

	if (displayStateNumber < 0) {
		displayStateNumber = totalStates-1;
	}

	printElevatorState(elevatorStateList[displayStateNumber]);
}

// stores elevator states in a list
function getElevatorStates() {
	elevatorStateList.push(elevatorState1);
	elevatorStateList.push(elevatorState2);
	elevatorStateList.push(elevatorState3);
	elevatorStateList.push(elevatorState4);
	elevatorStateList.push(elevatorState5);
}

// displays elevator states
function printElevatorState(elevator) {

	problem.innerHTML = "";

	// draws the board
	for (i in elevator) {
		problem.innerHTML += "xx";
		for (j in elevator[i]) {
			problem.innerHTML += elevator[i][j] + "x";
		}
		problem.innerHTML += "x<br>";
	}

	var displayState = displayStateNumber+1;
	problem.innerHTML += "State: " + displayState;
}


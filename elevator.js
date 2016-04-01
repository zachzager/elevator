// elevator.js

var elevatorState = 0;
var position;
var problem;
var displayStateNumber = 0;
var stateNumber = 0;
elevatorStateList = [];
starting_elevator = '';
final_destination = {};
final_destination.floor = 0;
final_destination.time = 0;
solutionList = [];

// get all HTML elements
function setup() {
	form = document.getElementById('file_form');
	setup_form(); // gives the form the submit function
	fileSelect = document.getElementById('file_select');
	problem = document.getElementById("problem");
	solution = document.getElementById("solution");
	start = document.getElementById("start");
	fd_floor = document.getElementById("fd_floor");
	fd_time = document.getElementById("fd_time");
}

function setup_form() {
	form.onsubmit = function(event) {
		event.preventDefault();
		elevatorStateList = []; // resets elevatorStateList
		displayStateNumber = 0; // resets displayStateNumber
		solution.innerHTML = "Solution: "; // resets solution

		reader = new FileReader();
		reader.onload = function(e) { // fills state list and prints first state
			parse_text();
			printElevatorState(elevatorStateList[displayStateNumber]);
		}
		reader.readAsText(fileSelect.files[0]); // allows inputted file to be read
	}
}

// loops through text placing each elevator state
// in the elevatorStateList
function parse_text() {
	var text = reader.result;
	var single_state = [];
	var single_row = [];

	for (var x = 0; x < text.length; x++) {
		if (text[x] == '\n' && text[x + 1] == '\n') {
			single_state.push(single_row);
			elevatorStateList.push(single_state);
			single_state = [];
			single_row = [];
			x++;
		} else if (text[x] == '\n')  { 
			single_state.push(single_row);
			single_row = [];
		}else {
			single_row.push(text[x]);
		}
	}
}

// starts checking through elevator states
function calculate() {

	// sets inputted values
	final_destination.time = Number(fd_time.value);
	final_destination.floor=elevatorStateList[0].length-Number(fd_floor.value);
	starting_elevator = start.value; // 
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
	if (state < elevatorStateList.length) {

		// check adjacent elevators
		goToRightElevator(curr_coords, path, state, prev_elevator);
		goToLeftElevator(curr_coords, path, state, prev_elevator);

		// stay on current elevator
		path += elevatorStateList[state][curr_coords[0]][curr_coords[1]];
		state += 1;
		determinePaths([getLevel(curr_coords[1],state),
							curr_coords[1]],path,state,prev_elevator);
		checkForSolution(curr_coords[0],state,path);
	}
}

// go to right elevator [when possible]
function goToRightElevator(curr_coords, path, state, prev_elevator) {
	if (elevatorStateList[state][curr_coords[0]][curr_coords[1]+1] !== '.' &&
		elevatorStateList[state][curr_coords[0]][curr_coords[1]+1] !== '' &&
		typeof elevatorStateList[state][curr_coords[0]][curr_coords[1]+1]!=="undefined"
		&& elevatorStateList[state][curr_coords[0]][curr_coords[1]+1]!==prev_elevator){
		determinePaths([curr_coords[0], curr_coords[1]+1],path,
					state,elevatorStateList[state][curr_coords[0]][curr_coords[1]]);
	}

}

// go to left elevator [when possible]
function goToLeftElevator(curr_coords, path, state, prev_elevator) {
	if (elevatorStateList[state][curr_coords[0]][curr_coords[1]-1] !== '.' &&
		elevatorStateList[state][curr_coords[0]][curr_coords[1]-1] !== '' &&
		typeof elevatorStateList[state][curr_coords[0]][curr_coords[1]-1]!=="undefined"
		&& elevatorStateList[state][curr_coords[0]][curr_coords[1]-1]!==prev_elevator){
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
	} else {
		console.log("NO SOLUTION :(");
	}
	solutionList = [];
}

// goes through whole elevator state to find starting elevator
function getFirstCoords() {
	for (x in elevatorStateList[0]) {
		for (y in elevatorStateList[0][x]) {
			if (elevatorStateList[0][x][y] === starting_elevator) {
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

	if (displayStateNumber == elevatorStateList.length) {
		displayStateNumber = 0;
	}
	printElevatorState(elevatorStateList[displayStateNumber]);
}

// responds to user clicking the button to cycle through elevator
function prevState() {
	displayStateNumber--;

	if (displayStateNumber < 0) {
		displayStateNumber = elevatorStateList.length-1;
	}
	printElevatorState(elevatorStateList[displayStateNumber]);
}

// displays elevator states, places x's between each letter
function printElevatorState(elevator) {

	problem.innerHTML = "";

	for (i in elevator) { // draws the board
		problem.innerHTML += "xx";
		for (j in elevator[i]) {
			problem.innerHTML += elevator[i][j] + "x"; 
		}
		problem.innerHTML += "x<br>";
	}
	var displayState = displayStateNumber+1;
	problem.innerHTML += "State: " + displayState;
}

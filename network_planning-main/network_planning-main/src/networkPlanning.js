let graph = [];
let graphLength;
let earlyDeadlinesArray = [];
let lateDeadlinesArray = [];
let timeReservesArray = [];

class Graph {
  constructor(verticesCount) {
    this.matrix = [];
    for (let i = 0; i < verticesCount; i++) {
      this.matrix.push(new Array(verticesCount).fill(0));
    }
  }

  addEdge(vertex1, vertex2, wayLength) {
    this.matrix[vertex1][vertex2] = wayLength;
  }
}

document.getElementById("findDistances").addEventListener("click", findDistances);
createDefaultGraph();

function createDefaultGraph() {
  const defaultGraph = new Graph(10);
  defaultGraph.addEdge(0, 1, 14);
  defaultGraph.addEdge(1, 2, 24);
  defaultGraph.addEdge(2, 4, 12);
  defaultGraph.addEdge(2, 5, 18);
  defaultGraph.addEdge(3, 5, 26);
  defaultGraph.addEdge(4, 6, 6);
  defaultGraph.addEdge(5, 6, 20);
  defaultGraph.addEdge(5, 7, 6);
  defaultGraph.addEdge(5, 8, 8);
  defaultGraph.addEdge(6, 8, 24);
  defaultGraph.addEdge(7, 8, 34);
  defaultGraph.addEdge(8, 9, 12);

  outputGraph(defaultGraph);
}

function outputGraph(createdGraph) {
  console.log(createdGraph);
  graph = createdGraph;
  graphLength = createdGraph.matrix.length;
  let graphLabel = document.getElementById("graph");

  graphLabel.textContent = "";

  for (let i = 0; i < graphLength; i++) {
    for (let j = 0; j < createdGraph.matrix[i].length; j++) {
      console.log(`Matrix[${i}][${j}]`, createdGraph.matrix[i][j]);
      if (createdGraph.matrix[i][j] !== 0) {
        graphLabel.innerHTML += `${i} -> ${j} {<b>${createdGraph.matrix[i][j]}</b>}<br><br>`;
      }
    }
  }
}

function findDistances() {
  findEarlyDeadlines();
  findLateDeadlines(earlyDeadlinesArray);
  findTimeReserves(earlyDeadlinesArray, lateDeadlinesArray);
  findCriticalPath(timeReservesArray);
}

function findEarlyDeadlines() {
  let maxDistancesArray = [];

  for (let i = 0; i < graphLength; i++) {
    maxDistancesArray[i] = 0;
  }

  for (let i = 0; i < graphLength; i++) {
    for (let j = 0; j < graphLength; j++) {
      if (graph.matrix[i][j] !== 0) {
        let maxDistance = graph.matrix[i][j] + maxDistancesArray[i];
        if (maxDistance > maxDistancesArray[j]) {
          maxDistancesArray[j] = maxDistance;
        }
      }
    }
  }
  earlyDeadlinesArray = maxDistancesArray;
  console.log("Early Deadlines: " + maxDistancesArray);
  displayDistances(maxDistancesArray, "earlyDeadlines");
}

function findLateDeadlines(distances) {
  let minDistancesArray = [];

  for (let i = 0; i < graphLength; i++) {
    minDistancesArray[i] = 0;
  }

  for (let i = graphLength - 1; i >= 0; i--) {
    let firstAppeal = true;
    for (let j = graphLength - 1; j >= 0; j--) {
      if (graph.matrix[i][j] !== 0) {
        let lateTerm = minDistancesArray[j] - graph.matrix[i][j];

        if (firstAppeal) {
          minDistancesArray[i] = lateTerm;
          firstAppeal = false;
        } else {
          if (lateTerm < minDistancesArray[i]) {
            minDistancesArray[i] = lateTerm;
          }
        }
      }
    }
    if (minDistancesArray[i] === 0) {
      minDistancesArray[i] = distances[i];
    }
  }
  lateDeadlinesArray = minDistancesArray;
  console.log("Late Deadlines: " + minDistancesArray);
  displayDistances(minDistancesArray, "lateDeadlines");
}

function findTimeReserves(firstArray, secondArray) {
  let timeReserves = [];

  for (let i = 0; i < graphLength; i++) {
    timeReserves[i] = secondArray[i] - firstArray[i];
  }

  timeReservesArray = timeReserves;
  console.log("Time Reserves: " + timeReserves);
  document.getElementById("timeReserves").innerHTML = "<b>Time Reserves: <br><br>" + timeReserves + "<br> <br>";
}

function findCriticalPath(reserves) {
  let criticalPath = [];

  for (let i = 0; i < reserves.length; i++) {
    if (reserves[i] === 0) {
      criticalPath.push(i * 2);
    }
  }
  console.log("Critical Path: " + criticalPath);
  document.getElementById("criticalPath").innerHTML = "<b>Critical Path:<br><br>" + criticalPath;
}

function displayDistances(arrayForDisplaying, labelForText) {
  for (let i = 0; i < arrayForDisplaying.length; i++) {
    document.getElementById(labelForText).innerHTML +=
        `0 -> ${i} ~~ ${arrayForDisplaying[i]}<br><br>`;
  }
}


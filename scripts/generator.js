var verticesRange = document.getElementById("verticesRange");
var verticesValue = document.getElementById("verticesValue");
var edgesRange = document.getElementById("edgesRange");
var edgesValue = document.getElementById("edgesValue");
var s = new sigma('container');

s.settings({
    sideMargin: 0.3,
    zoomingRatio: 1.25,
    doubleClickZoomingRatio: 2,
    font: "cabin",
    defaultLabelSize: 12,
    labelThreshold: 1
});

function ShowValuesFromSliders() {
    verticesValue.innerHTML = verticesRange.value;
    edgesValue.innerHTML = edgesRange.value;

    verticesRange.oninput = function () {
        verticesValue.innerHTML = this.value;
    }

    edgesRange.oninput = function () {
        edgesValue.innerHTML = this.value;
    }
}

function GenerateVertices() {
    var centerX = 0;
    var centerY = 0;
    var radius = -1;

    for (var i = 0, value = verticesRange.value; i < value; i++) {
        s.graph
            .addNode({
                id: `n${i}`,
                label: `V${i + 1}`,
                x: centerX + radius * Math.sin(360 / verticesRange.value * i * Math.PI / 180),
                y: centerY + radius * Math.cos(360 / verticesRange.value * i * Math.PI / 180),
                size: 1,
                color: '#0000fa'
            });
    }
}

function GenerateEdges() {
    var vertices = s.graph.nodes();
    var chanceToCreateEdge = edgesRange.value;
    var id = 0;

    for (var i = 0, length = vertices.length; i < length; i++) {
        for (var j = i + 1; j < length; j++) {
            var randomNumber = Math.floor(Math.random() * 100)

            if (chanceToCreateEdge > randomNumber) {
                s.graph.addEdge({
                    id: `e${id}`,
                    source: `n${i}`,
                    target: `n${j}`,
                    color: '#c8c8ff'
                });

                id++;
            }
        }
    }
}

function ShowVertexDegree() {
    var vertices = s.graph.nodes();

    for (var i = 0, verticesLength = vertices.length; i < verticesLength; i++) {
        var id = `n${i}`;
        vertices[i].label += ` (${s.graph.degree(id)})`;
    }
}

function GenerateGraph() {
    s.graph.clear();
    GenerateVertices();
    GenerateEdges();
    ShowVertexDegree();
    s.refresh();
}

function GetNeighbors(i) {
    var vertices = s.graph.nodes();
    var edges = s.graph.edges();
    var neighbors = [];

    for (var j = 0, edgesLength = edges.length; j < edgesLength; j++) {
        if (edges[j].source == vertices[i].id) {
            neighbors.push(vertices.find(x => x.id == edges[j].target));
        }
        else if (edges[j].target == vertices[i].id) {
            neighbors.push(vertices.find(x => x.id == edges[j].source));
        }
    }

    return neighbors;
}

function ColoringVertex() {
    var vertices = s.graph.nodes();
    var colors = ['#ff0000', '#ffbf00', '#ffff00', '#00ff00', '#009933', '#00ffff', '#0000ff', '#ff00ff', '#996633', '#000000'];
    var reservedColors = colors.slice(0, vertices.length);

    for (var i = 0, verticesLength = vertices.length; i < verticesLength; i++) {
        var availableColors = reservedColors.slice();
        var neighbors = GetNeighbors(i);

        if (neighbors.length > 0) {
            for (var j = 0, neighborsLength = neighbors.length; j < neighborsLength; j++) {
                for (var k = 0, colorsLength = reservedColors.length; k < colorsLength; k++) {
                    if (neighbors[j].color == availableColors[k]) {
                        availableColors.splice(k, 1);
                    }
                }
            }
            s.graph.nodes(`n${i}`).color = availableColors[0];
        }
        else {
            s.graph.nodes(`n${i}`).color = availableColors[0];
        }
    }
}

function GetNeighborEdges(i) {
    var vertices = s.graph.nodes();
    var edges = s.graph.edges();
    var neighborEdges = [];

    for (var j = 0, verticesLength = vertices.length; j < verticesLength; j++) {
        if (edges[i].source == vertices[j].id || edges[i].target == vertices[j].id) {
            for (var k = 0, edgesLength = edges.length; k < edgesLength; k++) {
                if (edges[i].id != edges[k].id && (vertices[j].id == edges[k].source || vertices[j].id == edges[k].target)) {
                    neighborEdges.push(edges[k]);
                }
            }
        }
    }

    return neighborEdges;
}

function ColoringEdges() {
    var edges = s.graph.edges();
    var colors = ['#ff0000', '#ffbf00', '#ffff00', '#00ff00', '#009933', '#00ffff', '#0000ff', '#ff00ff', '#996633', '#000000', '#800000', '#800080', '#808000', '#C0C0C0', '#008080'];

    for (var i = 0, edgesLength = edges.length; i < edgesLength; i++) {
        var availableColors = colors.slice();
        var neighborEdges = GetNeighborEdges(i);

        if (neighborEdges.length > 0) {
            for (var j = 0, neighborEdgesLength = neighborEdges.length; j < neighborEdgesLength; j++) {
                for (var k = 0, colorsLength = colors.length; k < colorsLength; k++) {
                    if (neighborEdges[j].color == availableColors[k]) {
                        availableColors.splice(k, 1);
                    }
                }
            }
            s.graph.edges(`e${i}`).color = availableColors[0];
        }
        else {
            s.graph.edges(`e${i}`).color = availableColors[0];
        }
    }
}

function AddOrDeleteEdge(i, addEdge) {
    var vertices = s.graph.nodes();
    var edges = s.graph.edges();

    for (var j = 0, verticesLength = vertices.length; j < verticesLength; j++) {
        if (i == j) {
            continue;
        }
        else if (s.graph.degree(`n${j}`) % 2 != 0 || s.graph.degree(`n${j}`) == 0) {
            var edge = edges.find(x => (x.source == `n${i}` || x.source == `n${j}`) && (x.target == `n${i}` || x.target == `n${j}`));

            if (addEdge && edge == null) {
                s.graph.addEdge({
                    id: `e${edges.length}`,
                    source: `n${i}`,
                    target: `n${j}`,
                    color: '#c8c8ff'
                });
                edgeWasAdded = true;
            }
            else if (!addEdge && edge != null) {
                s.graph.dropEdge(edge.id);
            }
            edges = s.graph.edges();
        }
    }
}

function GenerateEulerianGraph() {
    var vertices = s.graph.nodes();
    var addEdge = true;
    var edgeWasAdded = false;

    for (var k = 0, iterations = 10; k < iterations; k++) {
        if (edgeWasAdded) {
            addEdge = true;
            iterations++;
        }
        edgeWasAdded = false;

        for (var i = 0, verticesLength = vertices.length; i < verticesLength; i++) {
            var neighbors = GetNeighbors(i);
            var id = `n${i}`;

            if (neighbors.length % 2 != 0 || neighbors.length == 0) {
                AddOrDeleteEdge(i, addEdge, edgeWasAdded);
            }
            vertices[i].label = `V${i + 1} (${s.graph.degree(id)})`;
        }
        addEdge = false;
    }
}

$('.generateGraphButton').on('click', function () {
    GenerateGraph();
})

$('.useAlgorithmButton').on('click', function () {
    var chosenAlgorithm = Array.from(document.getElementsByName("algorithm")).find(r => r.checked).value;

    if (chosenAlgorithm == 'vertex_coloring') {
        ColoringVertex();
    }
    else if (chosenAlgorithm == 'edges_coloring') {
        ColoringEdges();
    }
    else if (chosenAlgorithm == 'generate_eulerian_graph') {
        GenerateEulerianGraph();
    }

    s.refresh();
})

ShowValuesFromSliders();
GenerateGraph();
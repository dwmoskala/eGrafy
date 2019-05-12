var verticesRange = document.getElementById("verticesRange");
var verticesValue = document.getElementById("verticesValue");
var edgesRange = document.getElementById("edgesRange");
var edgesValue = document.getElementById("edgesValue");
var s = new sigma('container');

s.settings({
    sideMargin: 0.3
});

function ShowValuesFromSliders() {
    verticesValue.innerHTML = verticesRange.value;
    edgesValue.innerHTML = edgesRange.value;

    verticesRange.oninput = function () {
        verticesValue.innerHTML = this.value;
    };

    edgesRange.oninput = function () {
        edgesValue.innerHTML = this.value;
    };
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
    var chanceToCreateEdge = edgesRange.value;
    var vertices = s.graph.nodes();
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
                })
            }
            id++;
        }
    }
}

function ShowVertexDegree() {
    var nodes = s.graph.nodes();
    
    for (var i = 0, nodesLength = nodes.length; i < nodesLength; i++) {
        var id = `n${i}`;

        nodes[i].label += ` (${s.graph.degree(id)})`;
    }
}

function GenerateGraph() {
    s.graph.clear();
    GenerateVertices();
    GenerateEdges();
    ShowVertexDegree();
    s.refresh();
}

function ColoringVertex() {
    var nodes = s.graph.nodes();
    var edges = s.graph.edges();
    var colors = ['#ff0000', '#ffbf00', '#ffff00', '#00ff00', '#009933', '#00ffff', '#0000ff', '#ff00ff', '#996633', '#000000'];
    var reservedColors = colors.slice(0, nodes.length);

    for (var i = 0, nodesLength = nodes.length; i < nodesLength; i++) {
        var neighbors = [];
        var availableColors = reservedColors.slice();

        for (var j = 0, edgesLength = edges.length; j < edgesLength; j++) {
            if (edges[j].source == nodes[i].id) {
                neighbors.push(nodes.find(x => x.id == edges[j].target));
            }
            if (edges[j].target == nodes[i].id) {
                neighbors.push(nodes.find(x => x.id == edges[j].source));
            }
        }

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

$('.generateGraphButton').on('click', function () {
    GenerateGraph();
})

$('.useAlgorithmButton').on('click', function () {
    var chosenAlgorithm = Array.from(document.getElementsByName("algorithm")).find(r => r.checked).value;

    if (chosenAlgorithm == 'vertex_coloring') {
        ColoringVertex();
    }

    s.refresh();
})

ShowValuesFromSliders();
GenerateGraph();
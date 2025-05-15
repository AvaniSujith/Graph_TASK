function createGraph({ container, id, title }){
    const graphWrapper = document.createElement("div");
    graphWrapper.className = 'graph-wrapper';
    graphWrapper.id = id;

    const heading = document.createElement("h2");
    heading.className = 'graph-header';
    heading.textContent = title;

    const controllers = document.createElement("div");
    controllers.className = "controls";
    controllers.innerHTML = `
        <label>Rows: <input type="number" class="rows-input"></label>
        <label>Columns: <input type="number" class="cols-input"></label>
        <button class="generate-btn">Generate</button>
        <button class="delete-btn">Delete</button>
    `;

    const grid = document.createElement("div");
    grid.className = "grid";

    graphWrapper.appendChild(heading);
    graphWrapper.appendChild(controllers);
    graphWrapper.appendChild(grid);
    container.appendChild(graphWrapper);

    const rowInput = controllers.querySelector(".rows-input");
    const colInput = controllers.querySelector(".cols-input");
    const generateBtn = controllers.querySelector(".generate-btn");
    const deleteBtn = controllers.querySelector(".delete-btn");

    generateBtn.addEventListener("click", () =>{
        const rows = parseInt(rowInput.value);
        const columns = parseInt(colInput.value);

        if(!rows || !columns) return alert("Please enter both rows and columns");

        grid.innerHTML = "";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${columns}, 40px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 40px)`;

        for(let r = 0; r < rows ; r++){
            for(let c = 0; c < columns; c++){
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.textContent = `${r + 1} x ${c + 1}`;
                grid.appendChild(cell);
            }
        }
    });

    deleteBtn.addEventListener("click", () => {
        graphWrapper.remove();
    });

}


function init(){
    const addGraphBtn = document.getElementById("add-graph");
    const graphContainer =document.getElementById("graph-container");
    let graphCount = 0;

    addGraphBtn.addEventListener("click", () => {
        graphCount++;
        createGraph({
            container: graphContainer,
            id: `graph-${graphCount}`,
            title: `Graph ${graphCount}`
        });
        
    });
}

document.addEventListener("DOMContentLoaded", init);
function createGraph({container, id, title}){
    const wrapper = buildWrapper(container, id, title);
    const grid = wrapper.querySelector(".grid-container");
    const inputs = getInputs(wrapper);
    const state = { rows: 0, columns: 0};

    bindEvents(wrapper, inputs, grid, state, container);
}

function buildWrapper(container, id, title){
    const wrapper = document.createElement("div");
    wrapper.className = "graph-wrapper";
    wrapper.id = id;
    wrapper.innerHTML = `
        <h2>${title}</h2>
        <div class="input-controls">
            <label>Rows: <input type="number" class="rows-input" /></label>
            <label>Columns: <input type="number" class="cols-input" /></label>
            <button class="generate-btn">Generate</button>
        </div>
        <div class="color-controls">
            <label>Row number: <input type="number" class="y-pos" /></label>
            <label>Column number: <input type="number" class="x-pos" /></label>
            <label>Color : <input type="color" class="color-picker" /></label>
            <button class="mark-btn">Mark</button>
            <button class="clear-btn">Clear</button>
            <button class="reset-btn">Reset</button>
            <button class="delete-btn">Delete Graph</button>
        </div>
        <div class="grid-container"></div>
    `;

    container.appendChild(wrapper);
    return wrapper;
}

function getInputs(wrapper){
    return {
        row: wrapper.querySelector(".rows-input"),
        col: wrapper.querySelector(".cols-input"),
        generate: wrapper.querySelector(".generate-btn"),
        y: wrapper.querySelector(".y-pos"),
        x: wrapper.querySelector(".x-pos"),
        color: wrapper.querySelector(".color-picker"),
        mark: wrapper.querySelector(".mark-btn"),
        clear: wrapper.querySelector(".clear-btn"),
        reset: wrapper.querySelector(".reset-btn"),
        delete: wrapper.querySelector(".delete-btn")
    };
}

function bindEvents(wrapper, inputs, grid, state, container){
    inputs.generate.addEventListener("click", () => generateGrid(grid, inputs, state));
    inputs.mark.addEventListener("click", () => markCell(wrapper, inputs, state));
    inputs.clear.addEventListener("click", () => clearMarks(grid, inputs));
    inputs.reset.addEventListener("click", () => resetGrid(grid, inputs, state));
    inputs.delete.addEventListener("click", () => container.removeChild(wrapper))
}

function generateGrid(grid, inputs, state){

    const rows = parseInt(inputs.row.value);
    const columns = parseInt(inputs.col.value);

    if(!rows || !columns || rows < 1 || columns < 1) return alert("Please enter both  valid rows and valid columns");

    grid.innerHTML = "";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${columns}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 40px)`;

    for(let r = 1; r <= rows ; r++){
        for(let c = 1; c <= columns; c++){
            const cell = document.createElement("div");
            cell.className = `cell row-${r} col-${c}`;
            cell.textContent = `${r} x ${c}`;
            grid.appendChild(cell);
        }
    }

    state.rows = rows;
    state.cols = columns;
}


function markCell(wrapper, inputs, state){
    const y = parseInt(inputs.y.value);
    const x = parseInt(inputs.x.value);

    if(!y || !x || y > state.rows || x > state.cols || y < 1 || x < 1){
        alert("Invalid coordinates.");
        return;
    }

    const cell = wrapper.querySelector(`.row-${y}.col-${x}`);
    if(cell){
        cell.style.backgroundColor = inputs.color.value;
        toggleMark(inputs, true);
    }
}    

function clearMarks(grid, inputs){
    grid.querySelectorAll(".cell").forEach(cell => cell.style.backgroundColor = "");
    toggleMark(inputs, false);
    inputs.y.value = "";
    inputs.color.value = "#000";
}


function resetGrid(grid, inputs, state){
    inputs.row.value = inputs.col.value = "";
    grid.innerHTML = "";
    state.rows = state.cols = 0;
}

function toggleMark(inputs, marked){
    inputs.mark.style.display = marked ? "none" : "inline-block";
    inputs.clear.style.display = marked ? "inline-block" : "none";
    inputs.y.disabled = inputs.x.disabled = inputs.color.disabled = marked;
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
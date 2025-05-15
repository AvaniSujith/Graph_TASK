function createGraph({container, id, title}){
    const wrapper = buildWrapper(container, id, title);
    const grid = wrapper.querySelector(".grid-container");
    const inputs = getInputs(wrapper);
    const state = { rows: 0, columns: 0};
    bindEvents(wrapper, inputs, grid, state, container);
}

function buildWrapper(container, id, title){
    const graphHeader = document.createElement("h2");
    graphHeader.className = 'heading';
    graphHeader.textContent = `${title}`;
    graphHeader.dataset.graphId = id;

    const wrapper = document.createElement("div");
    wrapper.className = "graph-wrapper";
    wrapper.id = id;
    wrapper.innerHTML = `
        <div class="input-controls">
            <div class="input-btns">
                <label>Rows: <input type="number" class="rows-input" /></label>
                <label>Columns: <input type="number" class="cols-input" /></label>
                <button class="generate-btn">Generate</button>
            </div>

            <div class="color-controls" style="display:none">
                <label>Row number: <input type="number" class="y-pos" /></label>
                <label>Column number: <input type="number" class="x-pos" /></label>
                <label>Color : <input type="color" class="color-picker" /></label>
                <button class="mark-btn">Mark</button>
                <button class="clear-btn" style="display:none;">Clear</button>
                <button class="plot-btn">Plot</button>
            </div>

            <div class="control-btns">
                <button class="reset-btn">Reset</button>
                <button class="delete-btn">Delete Graph</button>
            </div>
        </div>

        <div class="grid-container"></div>
       
    `;

    container.appendChild(graphHeader);
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
        plot: wrapper.querySelector(".plot-btn"),
        clear: wrapper.querySelector(".clear-btn"),
        reset: wrapper.querySelector(".reset-btn"),
        delete: wrapper.querySelector(".delete-btn"),
        inputBtns: wrapper.querySelector(".input-btns"),
        colorBtns: wrapper.querySelector(".color-controls")
    };
}

function bindEvents(wrapper, inputs, grid, state, container){
    inputs.generate.addEventListener("click", () => generateGrid(grid, inputs, state));
    inputs.mark.addEventListener("click", () => markCell(wrapper, inputs, state));
    inputs.clear.addEventListener("click", () => clearMarks(grid, inputs));
    inputs.reset.addEventListener("click", () => resetGrid(grid, inputs, state));
    inputs.delete.addEventListener("click", () => deleteGraph(wrapper, container));
    inputs.plot.addEventListener("click", () => plotGraph(wrapper, inputs, state));
}

function generateGrid(grid, inputs, state){

  
    // inputs.mark.style.display = "none";
    inputs.inputBtns.style.display = "none";
    inputs.colorBtns.style.display = "flex";

    const rows = parseInt(inputs.row.value);
    const columns = parseInt(inputs.col.value);

    if(!rows || !columns || rows < 1 || columns < 1) return alert("Please enter both  valid rows and valid columns");

    grid.innerHTML = "";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${columns}, 60px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 60px)`;

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

function plotGraph(wrapper, inputs, state){
    const y = parseInt(inputs.y.value);
    const x = parseInt(inputs.x.value);

    if(!y || !x || y > state.rows || x > state.cols || y < 1 || x < 1){
        alert("Invalid coordinates");
        return;
    }

    // const cells = document.querySelectorAll()

    for(let i = 1; i <= y; i++){
        // const cell = document.querySelector(`.row-${i}.col-${x}`);

        const cell = wrapper.querySelector(`.row-${i}.col-${x}`);

        if(cell){
        cell.style.backgroundColor = inputs.color.value;
        }
    }
}

function clearMarks(grid, inputs){
    grid.querySelectorAll(".cell").forEach(cell => cell.style.backgroundColor = "");
    toggleMark(inputs, false);
    inputs.y.value = "";
    inputs.x.value = "";
    inputs.color.value = "#000";
}

function resetGrid(grid, inputs, state){
    inputs.row.value = inputs.col.value = "";
    grid.innerHTML = "";
    inputs.y.value = "";
    inputs.x.value = "";
    inputs.color.value = "#000";
    state.rows = state.cols = 0;
    // wrapper.inputBtns.style.display = "flex";
    inputs.inputBtns.style.display = "flex";
    inputs.colorBtns.style.display = "none";
    toggleMark(inputs, false);

}

function deleteGraph(wrapper, container){
    const graphId = wrapper.id;
    const header = container.querySelector(`h2[data-graph-id=${graphId}]`);

    if(header){
        container.removeChild(header)
    }

    container.removeChild(wrapper);

    reOrderNumber(container);
}


function reOrderNumber(container){
    const wrappers = container.querySelectorAll(".graph-wrapper");

    wrappers.forEach((wrapper, index) => {
        const newNumber = index+1;
        const newId = `graph-${newNumber}`;
        const oldId = wrapper.id;

        wrapper.id = newId;

        const header = container.querySelector(`h2[data-graph-id="${oldId}"]`);

        if(header){
            header.textContent = `Graph ${newNumber}`;
            header.dataset.graphId = newId;
        }
    });
}

function toggleMark(inputs, marked){
    inputs.mark.style.display = marked ? "none" : "inline-block";
    inputs.clear.style.display = marked ? "inline-block" : "none";
    inputs.y.disabled = inputs.x.disabled = inputs.color.disabled = marked;
}

function init(){
    const addGraphBtn = document.getElementById("add-graph");
    const graphContainer =document.getElementById("graph-container");
    // let graphCount = 0;

    addGraphBtn.addEventListener("click", () => {
        // graphCount++;
        const existingGraphs = graphContainer.querySelectorAll(".graph-wrapper").length;
        const newGraphNumber = existingGraphs + 1;


        createGraph({
            container: graphContainer,
            id: `graph-${newGraphNumber}`,
            title: `Graph ${newGraphNumber}`
        });
        
    });
}

document.addEventListener("DOMContentLoaded", init);
function createGraph({container, id, title}){
    const wrapper = buildWrapper(container, id, title);
    const grid = wrapper.querySelector(".grid-container");
    const inputs = getInputs(wrapper);
    const state = { rows: 0, columns: 0};
    bindEvents(wrapper, inputs, grid, state, container);

    wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
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

            <div class="editing-controllers" style="display:none">
                <div class="margin-controllers">
                    <label>Top: <input type="number" class="margin-top" /></label>
                    <label>Right: <input type="number" class="margin-right" /></label>
                    <label>Bottom: <input type="number" class="margin-bottom" /></label>
                    <label>Left: <input type="number" class="margin-left" /></label>
                </div>
                <button class="validate-btn">Apply Margin</button>
                <div class="border-controller">
                    Remove Border
                    <label class="switch border-switch"> 
                        
                        <input type="checkbox" class="border-toggle">
                        <span class="slider round"></span>

                    </label>
                </div>
            </div>

            <div class="color-controls" style="display:none">

                <label>Row number: <input type="number" class="y-pos" /></label>
                <label>Column number: <input type="number" class="x-pos" /></label>
                <label>Color: <input type="color" class="color-picker" /></label>

                <div class="marking-btns">
                    <button class="mark-btn">Mark</button>
                    <button class="clear-btn" style="display:none;">Clear</button>
                    <button class="plot-btn">Plot</button>
                </div>

                <button class="editing-btn">Edit</button>

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
        colorBtns: wrapper.querySelector(".color-controls"),
        editingController:wrapper.querySelector(".editing-controllers"),
        editingBtn:wrapper.querySelector(".editing-btn"),
        topMargin:wrapper.querySelector(".margin-top"),
        rightMargin:wrapper.querySelector(".margin-right"),
        bottomMargin:wrapper.querySelector(".margin-bottom"),
        leftMargin:wrapper.querySelector(".margin-left"),
        applyMargin:wrapper.querySelector(".validate-btn"),
        borderHideBtn:wrapper.querySelector(".border-toggle")
    };
}

function bindEvents(wrapper, inputs, grid, state, container){
    inputs.generate.addEventListener("click", () => generateGrid(grid, inputs, state));
    inputs.mark.addEventListener("click", () => markCell(wrapper, inputs, state));
    inputs.clear.addEventListener("click", () => clearMarks(grid, inputs));
    inputs.reset.addEventListener("click", () => resetGrid(grid, inputs, state));
    inputs.delete.addEventListener("click", () => deleteGraph(wrapper, container));
    inputs.plot.addEventListener("click", () => plotGraph(wrapper, inputs, state));
    inputs.editingBtn.addEventListener("click", () => editingBoxController(inputs));
    inputs.applyMargin.addEventListener("click", () => editing(wrapper, inputs));

    if(inputs.borderHideBtn){
        inputs.borderHideBtn.addEventListener("change", () => toggleCellBorders(wrapper, inputs.borderHideBtn.checked));
    }
}

function generateGrid(grid, inputs, state){

    // inputs.mark.style.display = "none";
    inputs.inputBtns.style.display = "none";
    inputs.colorBtns.style.display = "flex";

    const rows = parseInt(inputs.row.value);
    const columns = parseInt(inputs.col.value);

    if(!rows || !columns || rows < 1 || columns < 1) return alert("Please enter both valid rows and valid columns");

    grid.innerHTML = "";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${columns}, 60px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 60px)`;

    for(let r = rows; r >= 1; r--){
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

        cell.textContent = "";

        const innerDiv = document.createElement("div");
        innerDiv.className = "color-box";
        innerDiv.style.backgroundColor = inputs.color.value;
        cell.appendChild(innerDiv);

        toggleMark(inputs, true)

        // const colorBox = cell.querySelector(".color-box");

        // if(colorBox){
        //     colorBox.style.backgroundColor = inputs.color.value;

        //     toggleMark(inputs, true);
        // }

    }
}   

function plotGraph(wrapper, inputs, state){
    const y = parseInt(inputs.y.value);
    const x = parseInt(inputs.x.value);

    if(!y || !x || y > state.rows || x > state.cols || y < 1 || x < 1){
        alert("Invalid coordinates");
        return; 
    }

    // const cells = document.querySelectorAll();
    for(let i = 1; i <= y; i++){

        // const cell = document.querySelector(`.row-${i}.col-${x}`);

        const cell = wrapper.querySelector(`.row-${i}.col-${x}`);

        if(cell){
            cell.textContent = "";

            const innerDiv = document.createElement("div");
            innerDiv.className = "color-box";
            innerDiv.style.backgroundColor = inputs.color.value;
            cell.appendChild(innerDiv);

            // const colorBox = cell.querySelectorAll(".color-box");

            // if(colorBox){
            //     colorBox.style.backgroundColor = inputs.color.value;
            //     toggleMark(inputs, true);
            // }
        }
    }

    toggleMark(inputs, true)
}

function editingBoxController(inputs){
    inputs.editingController.style.display = "flex";
    // inputs.inputBtns.style.display = "none";
    inputs.colorBtns.style.display = "none";
}

function editing(wrapper, inputs){
    const mTop = parseInt(inputs.topMargin.value) || 0;
    const mRight = parseInt(inputs.rightMargin.value) || 0;
    const mBottom = parseInt(inputs.bottomMargin.value) || 0;
    const mLeft = parseInt(inputs.leftMargin.value) || 0;

    const colorBoxes = wrapper.querySelectorAll(".color-box");

    if(colorBoxes.length > 0){
        colorBoxes.forEach(box => {
            box.style.marginTop = mTop + "px";
            box.style.marginRight = mRight + "px";
            box.style.marginBottom = mBottom + "px";
            box.style.marginLeft = mLeft + "px";

            box.style.width =`calc(100% - ${mLeft + mRight}px)`;
            box.style.height = `calc(100% - ${mTop + mBottom}px)`;
        })
    }   
}

function toggleCellBorders(wrapper, removeBorders){
    const colorBoxes = wrapper.querySelectorAll(".color-box");

    colorBoxes.forEach(box => {
        box.style.border = removeBorders ? "none" : "1px solid black";
    });
}

function clearMarks(grid, inputs, state){

    const rows = state.rows;
    const cols = state.cols;

    for(let r = 1; r <= rows; r++){
        for(let c = 1; c <= cols; c++){
            const cell = grid.querySelector(`.row-${r}.col-${c}`);
            if(cell){
                const colorBox = cell.querySelector(".color-box");
                if(colorBox){
                    cell.removeChild(colorBox);
                }
                cell.textContent = `${r} x ${c}`;
            }
        }
    }

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
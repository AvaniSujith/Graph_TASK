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
                <label>Rows: <input type="number" class="rows-input" min="1" max="150" autofocus/></label>
                <label>Columns: <input type="number" class="cols-input" min="1" max="150" /></label>
                <button class="generate-btn">Generate</button>
            </div>

            <div class="editing-controllers" style="display:none">
                <div class="margin-controllers">
                    <label>Top: <input type="number" class="margin-top" min="0" max="25" /></label>
                    <label>Right: <input type="number" class="margin-right" min="0" max="25" /></label>
                    <label>Bottom: <input type="number" class="margin-bottom" min="0" max="25" /></label>
                    <label>Left: <input type="number" class="margin-left" min="0" max="25" /></label>
                </div>
                <button class="validate-btn">Apply Margin</button>
                <button class="clear-margin" style="display:none;">Remove Margin</button>
                <div class="border-controller">
                    Remove Box Border
                    <label class="switch border-switch"> 
                        
                        <input type="checkbox" class="border-toggle">
                        <span class="slider round"></span>

                    </label>
                </div>
                <div class="border-controller">
                    Remove Grid Lines
                    <label class="switch border-switch"> 
                        
                        <input type="checkbox" class="cellBorderToggle">
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

                <button class="editing-btn" disabled>Edit</button>

            </div>

            <div class="control-btns">
                <button class="reset-btn" style="display:none;">Reset</button>
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
        removeMargin:wrapper.querySelector(".clear-margin"),
        borderHideBtn:wrapper.querySelector(".border-toggle"),
        gridBorderHide:wrapper.querySelector(".cellBorderToggle")
    };
}

function bindEvents(wrapper, inputs, grid, state, container){

    inputs.row.addEventListener("input", () => validateNumberInputWithFeedback(inputs.row, 1, 150, wrapper));
    inputs.col.addEventListener("input", () => validateNumberInputWithFeedback(inputs.col, 1, 150, wrapper));


    inputs.generate.addEventListener("click", () => generateGrid(grid, inputs, state));
    inputs.mark.addEventListener("click", () => markCell(wrapper, inputs, state));
    inputs.clear.addEventListener("click", () => clearMarks(grid, inputs, state));
    inputs.reset.addEventListener("click", () => resetGrid(grid, inputs, state));
    inputs.delete.addEventListener("click", () => deleteGraph(wrapper, container));
    inputs.plot.addEventListener("click", () => plotGraph(wrapper, inputs, state));
    inputs.editingBtn.addEventListener("click", () => editingBoxController(inputs));
    inputs.applyMargin.addEventListener("click", () => editing(wrapper, inputs));
    if(inputs.borderHideBtn){
        inputs.borderHideBtn.addEventListener("change", () => toggleCellBorders(wrapper, inputs.borderHideBtn.checked));
    }

    inputs.removeMargin.addEventListener("click", () => togglerResetMargin(inputs, wrapper));

    if(inputs.gridBorderHide){
        inputs.gridBorderHide.addEventListener("change", () => toggleGridBorders(wrapper, grid, inputs.gridBorderHide.checked));
    }
}

function validateNumberInputWithFeedback(inputElement, min, max, wrapper){
    let errorId = inputElement.className + "-error";
    let errorElement = document.getElementById(errorId);

    if(!errorElement){
        errorElement = document.createElement("span");
        errorElement.id = errorId;
        errorElement.className = "error-message";
        errorElement.style.color = "#ff3860";
        errorElement.style.fontSize = "12px";
        errorElement.style.display = "none";
        errorElement.style.marginLeft = "10px";
        inputElement.parentNode.appendChild(errorElement);
    }

    let value = parseInt(inputElement.value);

    if(inputElement.value === ""){
        errorElement.style.display = "none";
        return;
    }

    if(isNaN(value)){
        errorElement.textContent = "Please Enter a valid number";
        errorElement.style.display = "inline";
        inputElement.style.borderColor = "#ff3860";
        return;
    }

    if(value < min){
        errorElement.textContent = `Minimum value is ${min}`;
        errorElement.style.display = "inline";
        inputElement.style.borderColor = "#ff3860";
    } else if(value > max){
        errorElement.textContent = `Maximum value is ${max}`;
        errorElement.style.display = "inline";
        inputElement.style.borderColor = "#ff3860";
    }else{
        errorElement.style.display = "none";
        inputElement.style.borderColor = "#ff3860";
    }
}

function generateGrid(grid, inputs, state){

    const rows = parseInt(inputs.row.value);
    const columns = parseInt(inputs.col.value);

    if(!rows || !columns || rows < 1 || columns < 1) return alert("Please enter both valid rows and valid columns");

    inputs.reset.style.display = "block";
    inputs.inputBtns.style.display = "none";
    inputs.colorBtns.style.display = "flex";

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

    }
}   

function plotGraph(wrapper, inputs, state){
    const y = parseInt(inputs.y.value);
    const x = parseInt(inputs.x.value);

    if(!y || !x || y > state.rows || x > state.cols || y < 1 || x < 1){
        alert("Invalid coordinates");
        return; 
    }

    for(let i = 1; i <= y; i++){
        const cell = wrapper.querySelector(`.row-${i}.col-${x}`);

        if(cell){
            cell.textContent = "";

            const innerDiv = document.createElement("div");
            innerDiv.className = "color-box";
            innerDiv.style.backgroundColor = inputs.color.value;
            cell.appendChild(innerDiv);
        }
    }

    toggleMark(inputs, true)
}

function editingBoxController(inputs){
    
    inputs.editingController.style.display = "flex";
    inputs.colorBtns.style.display = "none";

}

function editing(wrapper, inputs){

    inputs.removeMargin.style.display = "block"
    inputs.applyMargin.style.display = "none"
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
        box.style.border = removeBorders ? "none" : "2px solid black";
    });
}

function toggleGridBorders(wrapper, grid, removeBorders){
    
    const cells = wrapper.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.style.border = removeBorders ? "none" : "1px solid #ccc";
    })

    // grid.style.borderLeft = removeBorders ? "1px solid #ccc" : "none";
    // grid.style.borderBottom = removeBorders ? "1px solid #ccc" : "none";

    if(removeBorders){

        const bottomRow = wrapper.querySelectorAll(`.row-1`);
        bottomRow.forEach(cell => {
            cell.style.borderBottom = "1px solid #000";
        });

        for(let r = 1; r <= parseInt(grid.style.gridTemplateRows.match(/repeat\((\d+)/)[1]); r++){
            const leftCell = wrapper.querySelector(`.row-${r}.col-1`);
            if(leftCell){
                leftCell.style.borderLeft = "1px solid #000";
            }
        }
    }
    
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

function togglerResetMargin(inputs, wrapper){

    if(inputs.removeMargin.style.display === "block"){

        inputs.topMargin.value = "0";
        inputs.rightMargin.value = "0";
        inputs.bottomMargin.value = "0";
        inputs.leftMargin.value = "0";

        const colorBoxes = wrapper.querySelectorAll(".color-box");
        if(colorBoxes.length > 0){
            colorBoxes.forEach(box => {
                box.style.marginTop = "0px";
                box.style.marginRight = "0px";
                box.style.marginBottom = "0px";
                box.style.marginLeft = "0px";

                box.style.width = "100%";
                box.style.height = "100%";
            });
        }

        inputs.removeMargin.style.display = "none";
        inputs.applyMargin.style.display = "block";
    }
   
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
    inputs.reset.style.display = "none";
    inputs.editingController.style.display = "none";
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
    inputs.y.disabled = inputs.x.disabled = marked;
    inputs.editingBtn.disabled = false;
}

function init(){

    const addGraphBtn = document.getElementById("add-graph");
    const graphContainer =document.getElementById("graph-container");

    addGraphBtn.addEventListener("click", () => {

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
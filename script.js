document.addEventListener("DOMContentLoaded", () => {

const gridContainer = document.getElementById("gridsContainer");

const yAxisLength = document.getElementById("yAxis");
const xAxisLength = document.getElementById("xAxis");
const generateGridBtn = document.getElementById("submit");

const colorBtn = document.getElementById("simpleColorBtn");
const colorX = document.getElementById("xNum");
const colorY = document.getElementById("yNum");
const colorPicker = document.getElementById("colorSelected");

const clearBtn = document.getElementById("clearBtn");

const resetBtn = document.getElementById("resetBtn");


const mainPage = document.querySelector('.main-content');
const firstPage = document.querySelector('.container-modal');

// resetBtn.disabled = true;
// colorX.disabled = true;
// colorY.disabled = true;
// colorBtn.disabled = true;
// colorPicker.disabled = true;

resetBtn.addEventListener("click", () => {
    window.location.reload()
});

generateGridBtn.addEventListener("click", ()=>{


    console.log("Click");

    // resetBtn.disabled = false;
    // colorX.disabled = false;
    // colorY.disabled = false;
    // colorBtn.disabled = false;
    // colorPicker.disabled = false;

    // generateGridBtn.disabled = true;
    // yAxisLength.disabled = true;
    // xAxisLength.disabled = true;

    const rowNum = parseInt(yAxisLength.value);
    const colNum = parseInt(xAxisLength.value);

    if(!rowNum || !colNum){
        alert("Fill in the missing number. Row number and column number are both mandatory.");
        // return;
        window.location.reload()
        // rowNum = '';
        // colNum = '';
    }

    gridContainer.innerHTML ="";

    mainPage.style.display = "flex";
    firstPage.style.display ="none";

    


    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${colNum}, 80px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rowNum}, 80px)`;



    for(let row = 0; row < rowNum; row++){

        for(let col = 0; col < colNum; col++){
            const box = document.createElement("div");
            box.classList.add("box");
            box.classList.add(`row-${row + 1}`, `col-${col + 1}`);
            // box.style.border = "1px solid #ccc";
            box.innerHTML = `
                <p class="box-num">${row + 1} x ${col + 1} </p>
            `
            gridContainer.appendChild(box);
        }

    }
});

colorBtn.addEventListener("click", () => {

    const rowNum = parseInt(colorY.value);
    const colNum = parseInt(colorX.value);

    const inputRow = parseInt(yAxisLength.value);
    const inputCol = parseInt(xAxisLength.value);

    if(!rowNum || !colNum){
        alert('Information missing. Fill in both Row and Column');
        return;
    }

    if(rowNum > inputRow || rowNum <= 0 || colNum > inputCol || colNum <= 0){
        alert(`${rowNum} x ${colNum} not present, Try another input`);
        return;
    }

    const box = document.querySelector(`.row-${rowNum}.col-${colNum}`);

    if(box){

        box.style.backgroundColor = `${colorPicker.value}`;

        colorX.disabled = true;
        colorY.disabled = true;
        colorPicker.disabled = true;

        colorBtn.style.display = 'none';
        clearBtn.style.display = 'block';
    }


} );



clearBtn.addEventListener("click", () => {

    console.log("Clear btn clicked");

    colorX.value = '';
    colorY.value = '';
    colorPicker.value = '#000';


    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => {
        box.style.backgroundColor = '';

        colorX.disabled = false;
        colorY.disabled = false;
        colorPicker.disabled = false;

        clearBtn.style.display ='none';
        colorBtn.style.display = 'block';
    })


});


});
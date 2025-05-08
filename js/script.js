const startButton = document.getElementById('startGame');
let attempts = 0;
let steps = 0;


startButton.addEventListener('click', function(){
    const container = document.querySelector('div.container');
    
    resetPlayGrid();

    const bombsDifficulty = document.getElementById('bombsNumber').value;
    const gridSize = document.getElementById('gridSize').value;
    const totalCell = gridSize * gridSize;
    let numberBombs = 0;
    
    if(bombsDifficulty == 1){
        numberBombs = parseInt((totalCell * 10) / 100);
    }else if(bombsDifficulty == 2){
        numberBombs = parseInt((totalCell * 25) / 100);
    }else if(bombsDifficulty == 3){
        numberBombs = parseInt((totalCell * 50) / 100);
    }
    
    const bombsArray = getUniqueRandomArrayNumbers(0, totalCell, numberBombs);

    console.log('BombsNumber: ' + numberBombs + ' GridSize: '+ gridSize);
    console.log(bombsArray);

    createPlayGrid(gridSize, container, bombsArray);

});

// ------------------ FUNZIONI ------------------

function createCell(container, idCell, bombsArray, sideLength){
    const lifeCounter = document.querySelector('h3.counter');
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('id', idCell);

    cell.setAttribute('style', ('width: calc((100% / '+sideLength+') - 10px);height: calc((100% / '+sideLength+') - 10px);'));

    cell.innerHTML = `<pre>${idCell}</pre>`;
    container.appendChild(cell);
    cell.addEventListener('click', function(){
        if(cell.classList.contains('clicked-ok') || cell.classList.contains('clicked-boom')){
            return false;
        }else if(bombsArray.includes(idCell)){
            attempts++;
            stepBoom(container, cell, lifeCounter,bombsArray);
        }else if(!bombsArray.includes(idCell)){
            steps++;
            stepSafe(container, cell, idCell, sideLength, bombsArray, steps);
        }
    });
}

function stepSafe(container, cell, idCell, sideLength, bombsArray, steps){
    console.log(idCell);
    if(steps == ((sideLength * sideLength) - bombsArray.length)){

        // --------------- WIN ---------------
        showBoms(bombsArray);
        cell.classList.add('clicked-ok');
        container.classList.add('end-game');
        container.innerHTML += `<h2>Hai vinto! Yey`;
    }else if(bombsArray.includes(parseInt(idCell) - parseInt(sideLength))){// Controllo sopra
        cell.classList.add('clicked-near');
    }else if(bombsArray.includes(parseInt(idCell) + parseInt(sideLength))){// Controllo sotto
        cell.classList.add('clicked-near');
    }else if(bombsArray.includes(parseInt(idCell) + 1)){// Controllo dx
        //Controllo se la bomba è sulla riga successiva
        if(((parseInt(idCell)) % parseInt(sideLength)) == 0 ){
            cell.classList.add('clicked-ok');
        }else{
            cell.classList.add('clicked-near');
        }

    }else if(bombsArray.includes(parseInt(idCell) - 1)){// Controllo sx
        //Controllo se la bomba è sulla riga precedente
        if(((parseInt(idCell) - 1) % parseInt(sideLength)) == 0 ){
            cell.classList.add('clicked-ok');
        }else{
            cell.classList.add('clicked-near');
        }

    }else{
        cell.classList.add('clicked-ok');
    }
}

function stepBoom(container, cell, lifeCounter, bombsArray){
    cell.classList.add('clicked-boom');
    lifeCounter.innerHTML = 'Vite rimaste: ' + (6 - attempts);
    if(attempts == 6){            // Numero totale tentativi

        // --------------- LOOSE ---------------
        showBoms(bombsArray);
        cell.classList.add('clicked-boom');
        container.classList.add('end-game');
        container.innerHTML += `<h2>Hai perso... ma hai fatto ${steps} passi</h2>`
    }
}

function getUniqueRandomArrayNumbers(numMin, numMax, elements){
    if(numMax - numMin < elements){
        const errorMessage = 'Per creare un array di ' + elements + ' elementi unici ho bisogno di più elementi da cui poter scegliere'
        return errorMessage;
    }
    const uniqueArray = [];
    while(uniqueArray.length < elements){
        const num = randomNum(numMin, numMax);
        if(!uniqueArray.includes(num)){
            uniqueArray.push(num);
        }
    }
    return uniqueArray;
}

function randomNum(min, max){
    let randomNum;
    randomNum = Math.floor(Math.random() * max + min);
    return randomNum;
}


function createPlayGrid(sideLength, gridContainer, bombsArray){
    for(let i=0; i<(sideLength * sideLength); i++){
        createCell(gridContainer, (i+1), bombsArray, sideLength);
    }
}

function showBoms(bombsArray){
    for(let i=0; i<bombsArray.length; i++){
        console.log(bombsArray);
        const bombId = bombsArray[i];
        const bombCell = document.getElementById(bombId);
        bombCell.innerHTML = `<i class="fa-solid fa-bomb"></i>`;
    }
}
 
function resetPlayGrid(){
    const container = document.querySelector('div.container');
    const lifeCounter = document.querySelector('h3.counter');
    attempts = 0;
    steps = 0;
    lifeCounter.innerHTML = 'Vite rimaste: 6';
    container.classList.remove('end-game');
    container.innerHTML = '';
}
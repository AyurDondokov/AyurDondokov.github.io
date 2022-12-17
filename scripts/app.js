
(function () {
    
    let size = 12
    let bombCount = 10;
    let firstStep = true;
    let isGameOver = false;

    let bombIndex = document.querySelector('.bomb-index');
    let newgameBtn = document.querySelector('.newgame-btn');
    let mapElement = document.querySelector('.map');
    let map;


    function aroundBombs(x, y){
        res = 0;
        if (bombMap[y+1]){
            if (bombMap[y+1][x] && bombMap[y+1][x] == -1)
               res++;
            if (bombMap[y+1][x+1] && bombMap[y+1][x+1] == -1)
               res++;
            if (bombMap[y+1][x-1] && bombMap[y+1][x-1] == -1)
               res++;
        }
        if (bombMap[y-1]){
            if (bombMap[y-1][x] && bombMap[y-1][x] == -1)
               res++;
            if (bombMap[y-1][x+1] && bombMap[y-1][x+1] == -1)
               res++;
            if (bombMap[y-1][x-1] && bombMap[y-1][x-1] == -1)
               res++;
        }
        if (bombMap[y][x+1] && bombMap[y][x+1] == -1)
            res++;
        if (bombMap[y][x-1] && bombMap[y][x-1] == -1)
            res++;
        return res;
    }
    function OpenCell(cell){
        if (cell.classList.contains("opened") || cell.classList.contains("flag") || isGameOver)
            return;
        let x = cell.x;
        let y = cell.y;
        cell.classList.remove('flag');
        if (bombMap[y][x] > 0)
        {
            map[y][x].textContent =  bombMap[y][x];
            cell.classList.add("opened");
            return;
        }
        else if (bombMap[y][x] == -1)
        {
            cell.classList.add('bomb');
            Lose();
            return;
        }
        cell.classList.add("opened");


        if (map[y+1]){
            if (map[y+1][x])
                OpenCell(map[y+1][x], true);
            if (map[y+1][x+1])
                OpenCell(map[y+1][x+1], true);
            if (map[y+1][x-1])
                OpenCell(map[y+1][x-1], true);
        }

        if (map[y-1]){
            if (map[y-1][x])
                OpenCell(map[y-1][x], true);
            if (map[y-1][x+1])
                OpenCell(map[y-1][x+1], true);
            if (map[y-1][x-1])
                OpenCell(map[y-1][x-1], true);
        }
        
        if (map[y][x+1])
            OpenCell(map[y][x+1], true);
        if (map[y][x-1])
            OpenCell(map[y][x-1], true);


    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function NumsSpawn(){
        for (var i = 0; i < size; i++){
            for (var j = 0; j < size; j++){
                if (bombMap[j][i] !== -1)
                    bombMap[j][i] = aroundBombs(i,j);
            }
        }
    }
    function BombSpawn(elemClicked){
        count = 0
        xE = elemClicked.x;
        yE = elemClicked.y;
        while (count < bombCount){
            let x = getRandomInt(0, size);
            let y = getRandomInt(0, size);
            if (bombMap[y][x] !== -1 && !map[y][x].classList.contains('opened') && xE !== x && yE !== y){
                bombMap[y][x] = -1;
                count++;
            }
        }
        NumsSpawn();

    }
    function Win(){
        if (isGameOver)
            return;
        isGameOver = true;
        for (let y = 0; y < size; y++){
            for (let x = 0; x < size; x++){
                let cell = map[y][x];
                if (bombMap[y][x] == -1)
                {
                    cell.classList.add('bomb');
                    break;
                }
            }
        }
        setTimeout(function () {
            alert("You win!")
        }, 300);
    }
    function Lose(){
        isGameOver = true;
        for (let y = 0; y < size; y++){
            for (let x = 0; x < size; x++){
                let cell = map[y][x];
                if (bombMap[y][x] == -1)
                {
                    cell.classList.add('bomb');
                }
                cell.classList.remove('flag');
                cell.classList.add("opened");
            }
        }
        setTimeout(function () {
            alert("You loser!")
        }, 300);
    }

    function step(elem){
        if (firstStep){
            BombSpawn(elem);
            firstStep = false;
        }
        OpenCell(elem, false);
        if (size*size-bombCount <= document.querySelectorAll('.opened').length)
            Win();
    }

    function NewGame(){
        map = new Array(size);
        bombMap = new Array(size);
        firstStep = true;
        isGameOver = false;
        for (var i = 0; i < size; i++){
            map[i] = new Array(size);
            bombMap[i] = new Array(size);
        }
        mapElement.textContent = '';
        for (let y = 0; y < size; y++){
            for (let x = 0; x < size; x++){
                let item = document.createElement('div');
                item.className = 'element';
                item.addEventListener('click', e => {
                    step(e.target);
                });
                item.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    if (!e.target.classList.contains('opened') && !e.target.classList.contains('bomb')){
                        e.target.classList.toggle('flag');
                    }
                });
                
                item.x = x;
                item.y = y;
                mapElement.append(item);
                map[y][x] = item;
            }
        }
        
    }
    
    bombIndex.addEventListener('change', e => {
        if (bombIndex.value > 99)
            bombIndex.value = 99;
        bombCount = bombIndex.value;
    })
    newgameBtn.addEventListener('click', e => {
        NewGame();
    })

    trX = 0;
    trY = 0;
    
    document.addEventListener('keydown', e => {
        if (!map) return;
        map[trY][trX].classList.remove('highlighted');
        if (e.code == 'Enter'){
            step(map[trY][trX]);
            return;
        }
        if (e.key == 'ArrowUp' && map[trY-1])
            trY--;
        else if (e.key == 'ArrowDown' && map[trY+1])
            trY++;
        else if (e.key == 'ArrowRight' && map[trY][trX+1])
            trX++;
        else if (e.key == 'ArrowLeft' && map[trY][trX-1])
            trX--;
        map[trY][trX].classList.add('highlighted');
      })

})();
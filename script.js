const gameboard = (() => {
    const tiles = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

    const setTileAt = (index, player) => {
        if (index > tiles.length) return;
        tiles[index] = player;
    }

    const getTileAt = (index) => {
        if (index > tiles.length) return;
        return tiles[index];
    }

    const reset = () => {
        // tiles = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = {};
        }
    }

    // tiles is only for debug purposes
    return {tiles, setTileAt, getTileAt, reset};
})();

const displayController = (() => {
    const gameTiles = document.querySelectorAll('.tile');
    const rematchBtn = document.querySelector('#rematch');
    const bannerTxt = document.querySelector('#banner-txt');
    gameTiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
            console.log(e.target.dataset.index);
            if (!e.target.hasChildNodes()) {
                game.playRound(parseInt(e.target.dataset.index));
                updateTiles();
            }
        });
    });

    rematchBtn.addEventListener('click', (e) => {
        gameTiles.forEach(tile => {
            tile.textContent = '';
            tile.style.border = '4px solid white';
            gameboard.reset();
            game.reset();
            console.log(gameboard.tiles);
            console.log(game.round);
        })
    });

    const setBanner = (message, color) => {
        bannerTxt.textContent = message;
        bannerTxt.style.color = color;
    };

    const updateTiles = () => {
        for (let i = 0; i < gameTiles.length; i++) {
            gameTiles[i].textContent = gameboard.getTileAt(i).symbol;
            gameTiles[i].style.color = gameboard.getTileAt(i).color;
            gameTiles[i].style.border = `4px solid ${gameboard.getTileAt(i).color}`;
        }
    };

    console.log(gameTiles);
})();

const player = (symbol, color) => {
    return {symbol, color};
}


const game = (() => {
    // code for thought
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const p1 = player('X', 'dodgerblue');
    const p2 = player('O', 'red');
    let round = 1;
    let isOver = false;

    const playRound = (tileIndex) => {
        let currentPlayer = getCurrentPlayer();
        gameboard.setTileAt(tileIndex, currentPlayer);
        console.log(gameboard.tiles);
        round++;
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 0 ? p2.sign : p1.sign;
    }

    const getCurrentPlayerColor = () => {
        return round % 2 === 0 ? p2.color : p1.color;
    }

    const getCurrentPlayer = () => {
        return round % 2 === 0 ? p2 : p1;
    }

    const reset = () => {
        round = 1;
        isOver = false;
    }

    const getIsOver = () => {
        return isOver;
    }

    return {playRound, getIsOver, reset, round};
})();
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
        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = {};
        }
    }

    const getSymbolAt = (index) => {
        if (index > tiles.length) return;
        return tiles[index].symbol;
    }

    // tiles is only for debug purposes
    return {tiles, setTileAt, getTileAt, getSymbolAt, reset};
})();

const displayController = (() => {
    const gameTiles = document.querySelectorAll('.tile');
    const rematchBtn = document.querySelector('#rematch');
    const bannerTxt = document.querySelector('#banner-txt');
    gameTiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
            console.log(e.target.dataset.index);
            if (e.target.textContent == '' && game.getIsOver() == false) {
                game.playRound(parseInt(e.target.dataset.index));
                updateTiles();
            }
        });
    });

    rematchBtn.addEventListener('click', (e) => {
        gameTiles.forEach(tile => {
            tile.textContent = '';
            tile.style.border = '4px solid white';
            tile.style.boxShadow = '';
            setBanner(`Player X's Turn`, '#4dddff');
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
            gameTiles[i].style.boxShadow = `inset 0 0 0.5em 0 ${gameboard.getTileAt(i).color},  0 0 0.5em 0 ${gameboard.getTileAt(i).color}`
        }
    };

    console.log(gameTiles);
    return {setBanner};
})();

const player = (symbol, color) => {
    return {symbol, color};
}


const game = (() => {
    const pX = player('X', '#4dddff');
    const pO = player('O', 'hsl(317 100% 54%)');
    let round = 1;
    let isOver = false;

    const playRound = (tileIndex) => {
        let currentPlayer = getCurrentPlayer();
        gameboard.setTileAt(tileIndex, currentPlayer);
        if (checkWinner(tileIndex)) {
            displayController.setBanner(`Player ${getCurrentPlayerSymbol()} Wins!`);
            isOver = true;
            return;
        }
        if (round == 9) {
            displayController.setBanner('Draw!');
            isOver = true;
            return;
        }
        console.log(gameboard.tiles);
        round++;
        console.log(`-- Round ${round} --`);
        console.log(getCurrentPlayer());
        console.log(getCurrentPlayerColor());
        console.log(checkWinner(tileIndex));
        displayController.setBanner(`Player ${getCurrentPlayerSymbol()}'s Turn`, getCurrentPlayerColor());
    }

    const checkWinner = (tileIndex) => {
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

        // find a set of combinations that includes the current index, and returns whether or not there exists one combination in that set where every entry of that combination has the current players symbol.
        return winConditions
            .filter((combination) => combination.includes(tileIndex))
            .some((possibleCombination) =>
            possibleCombination.every(
                (index) => gameboard.getSymbolAt(index) === getCurrentPlayerSymbol()
            )
        );
    }

    const getCurrentPlayerSymbol = () => {
        return round % 2 === 0 ? pO.symbol : pX.symbol;
    }

    const getCurrentPlayerColor = () => {
        return round % 2 === 0 ? pO.color : pX.color;
    }

    const getCurrentPlayer = () => {
        return round % 2 === 0 ? pO : pX;
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
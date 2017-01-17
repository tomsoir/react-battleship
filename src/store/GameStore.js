import config from "../config.js";

import { EventEmitter } from "events";

class Store extends EventEmitter {

    constructor() {
        super();

        let { board, players, shipTypes, layout } = config;

        this.board = board;
        this.layout = layout;
        this.players = players;
        this.shipTypes = shipTypes;

        this.startGame();
    }

    /**
     * Utils
     */ 
    getBy( key ) {
        let result = {};
        result[key] = ( this[key] || console.error('Key is not specify') );
        return result;
    }

    /**
     * Initial funcs
     */ 
     startGame() {
        this.game = {
            start   : true,
            winner  : { name: undefined, count: 0 },
            field   : this.populateField(),
            ships   : this.populateShips(),
            players : this.populatePlayers()
        }

        return this.emit('changed');
    }
    populateField() {
        let field = [];
        let {rows, cols } = this.board;

        for (let x = 0; x <= rows; x++) 
            for (let y = 0; y <= cols; y++)
                field.push({ 
                    x : x, 
                    y : y, 
                    hit : false, 
                    selected : false
                });
        return field;
    }
    populateShips() {
        let ships = []; 

        this.layout.forEach( (item) => {
            let { ship, positions } = item;
            let life = this.shipTypes[ship].size;
            let pos = positions.map((arr) => arr.join(''));

            ships.push({ 
                ship: ship, 
                life: life, 
                positions: pos
            })
        })
        return ships;
    }
    populatePlayers(){
        let players = [];
        this.players.forEach((item) => players.push( 
            JSON.parse(JSON.stringify(item)) 
        ))
        return players;
    }

    /**
     * Component Board
     * @TODO: move to separate
     */ 
    makeMove( x, y, index ) {
        if ((typeof(x) === 'undefined' || x === null) ||
            (typeof(y) === 'undefined' || y === null) ||
            (typeof(index) === 'undefined' || index === null)) return;

        let state = this.checkHit(x, y);
        if(this.game.start){
            this.changeField(index, state.hit);
            this.changePlayer(state);
            this.changeStart();
            this.emit('changed');
        }
    }
    changeField( index, isHit ) {
        let { field } = this.game;
        field[index].selected = true;
        if(isHit) field[index].hit = true;
    }
    checkHit( x, y ) {
        let ship = this.game.ships.filter((ship) => {
            let fieldId = String(x)+y;
            let index = ship.positions.indexOf(fieldId);

            if(index !== -1)
                return this.removeDeck(ship, index);
        });
        return this.getState( ship );
    }

    /**
     * Component Ships
     * @TODO: move to separate
     */ 
    getState(ship){
        return { 
            hit : Boolean(ship.length),
            sunk : this.checkSunk(ship)
        }
    }
    removeDeck(ship, index) {
        ship.life--;
        ship.positions[index] = undefined;
        return ship;
    }
    checkSunk( arr ) {
        return (arr.length && arr[0].life===0)? true : false ;
    }


    /**
     * Component Result
     * @TODO: move to separate
     */ 
    changeStart() {
        this.game.start = Boolean(this.game.ships.filter((ship) => { 
            if(ship.life) return ship
        }).length);
        this.game.winner = this.getWinner();
    }

    getWinner(){
        let { players } = this.game;
        return players.reduce((a, b) => {
            return a.count > b.count ? a : b 
        });
    }

    /**
     * Component Players
     * @TODO: move to separate
     */ 
    changePlayer( state ){
        if (typeof(state) === 'undefined' || state === null) return;

        let {players} = this.game;
        players.some((player, i) => {
            if(player.move){
                if(state.hit){
                    if(state.sunk) player.count += 1
                }else{
                    player.move = false; 
                    this.switchPlayer( i+=1 );
                }
                return true;
            }
        })
    }
    switchPlayer(i) {
        let nextIndex = ( i === this.game.players.length ? 0 : i );
        let nextPlayer = this.game.players[nextIndex];
        nextPlayer.move = true;
    }
}

const store = new Store;

export default store;
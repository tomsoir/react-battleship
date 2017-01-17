import React from "react";
import Store from "../store/GameStore.js";

export default class Board extends React.Component {
    constructor() {
        super();
        this.state = Store.getBy('game');
    }
    clickHandler() {
        Store.startGame();
    }
    componentWillMount(){
        Store.on('changed', () => { 
            this.setState(Store.getBy('game'))
        });
    }
    render() {
        let { start } = this.state.game;
        let classes = start?'result':'result show';
        let {name, count} = this.state.game.winner;

        return (<div class={classes}>
            <div class="result-center">
                <h1 class="result-header">Game Over</h1>
                <h2 class="result-player">winner: {name},  score: {count}</h2>
                <button class="result-button" onClick={this.clickHandler.bind(this)}>Restart</button>
                <p><a href="https://github.com/tomsoir/react-battleship">GitHub</a></p>
            </div>
        </div>);
    }
}
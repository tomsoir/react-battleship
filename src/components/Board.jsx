import React from "react";
import Store from "../store/GameStore.js";

class Item extends React.Component {
    clickHandler() {
        let { x, y, selected } = this.props.item;
        let index = Number(String(x)+y);

        if( !selected )
            Store.makeMove(x, y, index);
    }
    render() {
        let {x, y, selected, hit} = this.props.item;
        let classes = ['board-item'];
        if( hit ) classes.push('hit');
        if( selected ) classes.push('selected');
        return (<li
            class={ classes.join(' ') } 
            onClick={ this.clickHandler.bind(this)}>{ x }{ y }</li>); // if CSS is off
    }
}

export default class Board extends React.Component {
    constructor() {
        super();
        this.state = Store.getBy('game');
    }
    componentWillMount(){
        Store.on('changed', () => { 
            this.setState(Store.getBy('game'))
        });
    }
    render() {
        let { field, start } = this.state.game;
        let classes = start? 'board' : 'board blur';

        return (<div class={classes}>
            <ul class="board-wrapper">
                {field.map((item,i) => {
                    return <Item key={'key'+i} item={item} />
                })}
            </ul>
        </div>);
    }
}
import React from "react";
import Store from "../store/GameStore.js";

class Item extends React.Component {
    render() {
        let { name, count, move } = this.props.item;
        let classes = ['players-item'];
        if( move ) classes.push('selected');

        return(
            <div class={ classes.join(' ') }>
                <b class="players-count">{ count }</b>
                <b class="players-name">{ name }</b>
            </div>
        );
    }
}

export default class Players extends React.Component {
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
        let { players, start} = this.state.game;
        let classes = start? 'players' : 'players  blur';
        return(<div class={classes} >
            {players.map((item, i) => {
                return <Item key={'item'+i} item={item} index={i}/>
            })}
        </div>);
    }
}
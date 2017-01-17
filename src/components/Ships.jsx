import React from "react";
import Store from "../store/GameStore.js";

class Ship extends React.Component {
    render() {
        let { ship, life, positions } = this.props.item;
        let path = './assets/'+ship+'.png';
        return(
            <li class='ships-item'>
                <img class='ships-image' src={path} />
                <ol class="deck">
                    {positions.map((pos, i)=>{
                        let classes = (life<=i? 'deck-item hit': 'deck-item ');
                        let values = (life<=i? 'X': '0');
                        return <li key={'item'+i} class={classes}>{values}</li>
                    }).reverse()}
                </ol>
            </li>
        );
    }
}

export default class Ships extends React.Component {
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
        let { ships, start } = this.state.game;
        let classes = start? 'ships' : 'ships blur';
        return(<ul class={classes}>
            {ships.map((ship, i)=>{
                return <Ship key={'item'+i} item={ship}/>
            })}
        </ul>);
    }
}
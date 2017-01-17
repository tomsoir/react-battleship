const styles = require("./style.less");
const parent = document.getElementById('app');

import React    from "react";
import ReactDOM from "react-dom";

import Board    from "./components/Board.jsx";
import Players  from "./components/Players.jsx";
import Ships    from "./components/Ships.jsx";
import Result   from "./components/Result.jsx";

ReactDOM.render(
    <section class="layout">
        <Board />
        <Players />
        <Ships />
        <Result />
    </section>
, parent);
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     position: props.position
        // }
    }
    render() {
        return (
            <button className="square" onClick={() => this.props.handleClick()}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            turn: 'X',
            gameOver: false,
            history: [],
            step: 0
        };

        this.winCondition = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 6, 8], [0, 4, 8], [2, 4, 6]];

        this.handleSquareClick = this.handleSquareClick.bind(this);
        this.timeTravel = this.timeTravel.bind(this);
    }
    renderSquare(i) {
        return <Square value={this.state.squares[i]} position={i} handleClick={()=>this.handleSquareClick(i)} />;
    }

    handleSquareClick(position) {
        if (this.state.gameOver || this.state.squares[position]){
            return
        }

        this.setState(prevState => {
            //store prevState.squares in history
            const prevHistory = prevState.history.slice();
            prevHistory.push(prevState.squares)

            //modify square[position] to w.e value is in turn
            const prevSquares = prevState.squares.slice();
            prevSquares[position] = this.state.turn;

            //toggle the value in turn
            let turn;
            if (prevState.turn === 'X')
                turn = 'O'
            else
                turn = 'X'
            return {
                squares: prevSquares,
                turn: turn,
                history: prevHistory,
                step: this.state.step + 1,
            }
        }, () => {
            const squares = this.state.squares;
            //check if the game is over
            const gameOver = this.winCondition.some(arr => {
                return squares[arr[0]] === squares[arr[1]] && squares[arr[0]] === squares[arr[2]] && squares[arr[0]] !== null;
            })
            if (gameOver) {
                console.log(this.state.history)
                console.log(this.state.step)
                //need to revert turn back since we toggled it even though game is over
                let turn;
                if (this.state.turn === 'X')
                    turn = 'O';
                else
                    turn = 'X';
                //need to add the final square to history
                const finalHistory = this.state.history.slice();
                finalHistory.push(this.state.squares)
                this.setState({
                    gameOver,
                    turn,
                    history:finalHistory
                })
            }

        })
    }

    timeTravel(direction) {
        const { step, history } = this.state;
        console.log(step)

        if (direction == 'forward') {
            if (step == history.length - 1)
                return
            console.log('moving forward in time')
            this.setState({
                squares: history[step + 1],
                step: step + 1
            })
        }
        else {
            if (step <= 0)
                return
            console.log('moving back in time')
            this.setState({
                squares: history[step - 1],
                step: step - 1
            })
        }
    }

    resetBoard(){
        this.setState({
            squares: Array(9).fill(null),
            turn: 'X',
            gameOver: false,
            history: [],
            step: 0
        })
    }

    render() {
        const status = `Next player: ${this.state.turn}`;

        return (
            <div>
                <div className="status">{this.state.gameOver ? this.state.turn + ' won!' : status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                <div style={{ display: 'flex' }}>
                    <button onClick={() => this.timeTravel('backward')}>prev</button>
                    <button onClick={() => this.timeTravel('forward')}>next</button>
                    <button onClick={()=>this.resetBoard()}>reset</button>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />

                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  
  return (
    <button style={{backgroundColor:props.win?'red':''}} className={`square ${props.selected? ' selected-square':''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isPartOfWinningLine, currentPosition) {
    return (
      <Square
        selected={currentPosition === i}
        win={isPartOfWinningLine}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const currentPosition = this.props.currentPosition;
    let counter = -1;
    return (
      <div>
        {[...Array(3)].map(() => {
          return (
            <div className="board-row" key={counter}>
              {
                [...Array(3)].map(() => {
                  counter++;
                  let win = false
                  this.props.winningCoord.forEach(ele=>{
                    if (ele === counter){
                      win = true;
                    }
                      
                  })
                  return (
                    this.renderSquare(counter, win, currentPosition)
                  )
                })
              }
            </div>
          )
        })
        }

      </div>
    );
  }
}

class Turns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: props.history,
      stepNumber: props.stepNumber,
      isOrderDesc: props.isOrderDesc,
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      history: props.history,
      stepNumber: props.stepNumber,
      isOrderDesc: props.isOrderDesc,
    }
  }

  render() {
    const history = this.state.history;
    const copyHistory = history.slice();
    if (!this.state.isOrderDesc){
      copyHistory.reverse();
    }
    return (
      <ol>
        {copyHistory.map((step, move) => {
          let naturalMove = move;
          let currentMove = [];
          let currentIdx;

          if (!this.state.isOrderDesc) {
            move = history.length-1-move
          }

            if (move !== 0) {
              step.squares.some((ele, idx) => {
                const nextMove = this.state.isOrderDesc ? move -1 : naturalMove +1
                  if (ele !== copyHistory[nextMove].squares[idx]) {
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    currentMove = [ele, row, col];
                    currentIdx = idx;
                    return true;
                  }
              })
            }
            let desc = move ?
              'Go to move #' + move :
              'Go to game start'
          
          return (
            <li key={move}>         
                <button style={{ fontWeight: this.state.stepNumber === move? 'bold':'normal' }} onClick={() => this.props.jumpTo(move, currentIdx)}>
                  {desc}
                  {currentMove.length ? ` player:${currentMove[0]} (${currentMove[1]},${currentMove[2]})` : ''}
                </button>
            </li>

          )
        }
        )

        }
      </ol>

    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isOrderDesc: true,
      winningCoord:[],
      currentPosition:null,//array of arrays of current positions eg [['X',0,1],['O',2,3]]  
    };

    this.jumpTo = this.jumpTo.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step, currentIdx) {
   
    this.setState(function(prevState){
      return {
        currentPosition:currentIdx,
        stepNumber: step,
        xIsNext: (step % 2) === 0
      }
     
    },()=>console.log(this.state.currentPosition))
  }

  reset(){
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isOrderDesc: true,
      winningCoord:[],
      currentPosition:[],
    })
  }
    

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).value : '';
    this.state.winningCoord = calculateWinner(current.squares) ? calculateWinner(current.squares).coord : [];

    const flipOrder = function () {
      this.setState(function (prevState) {
        return ({
          isOrderDesc: !prevState.isOrderDesc
        })
      })
    }.bind(this);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            currentPosition={this.state.currentPosition}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningCoord={this.state.winningCoord}
          />
          <button onClick={this.reset}>reset</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          {<Turns stepNumber={this.state.stepNumber}
            history={this.state.history}
            isOrderDesc={this.state.isOrderDesc}
            jumpTo={this.jumpTo}
          />}
        </div>
        <button  onClick={flipOrder}>FLIP</button>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        value:squares[a],
        coord:[a,b,c],
    }
  }
}
  return null;
}

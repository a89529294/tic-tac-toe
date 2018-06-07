import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  console.log('square win: ', props.win)
  const styleObj = props.win ? {backgroundColor:'red'}:{}
  return (
    <button style={styleObj} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isPartOfWinningLine) {
    return (
      <Square
        win={isPartOfWinningLine}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
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
                  console.log('winning coord in board',this.props.winningCoord)
                  this.props.winningCoord.forEach(ele=>{
                    if (ele === counter){
                      console.log('winning square: ', ele)
                      win = true;
                    }
                      
                  })
                  return (
                    this.renderSquare(counter, win)
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
    console.log(copyHistory)
    return (
      <ol>
        {copyHistory.map((step, move) => {
          let naturalMove = move;
          let currentMove = []

          if (!this.state.isOrderDesc) {
            move = history.length-1-move
          }

          console.log(move)
            if (move !== 0) {
              step.squares.some((ele, idx) => {
                const nextMove = this.state.isOrderDesc ? move -1 : naturalMove +1
                  if (ele !== copyHistory[nextMove].squares[idx]) {
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    currentMove = [ele, row, col];
                    return true;
                  }
                
              })
            }
            let desc = move ?
              'Go to move #' + move :
              'Go to game start'
          
          
          return (
            <li key={move}>
              {move === this.state.stepNumber ?
                <button style={{ fontWeight: 'bold' }} onClick={() => this.props.jumpTo(move)}>
                  {desc}
                  {currentMove.length ? ` player:${currentMove[0]} row:${currentMove[1]} col:${currentMove[2]}` : ''}
                </button>
                :
                <button onClick={() => this.props.jumpTo(move)}>
                  {desc}
                  {currentMove.length ? ` player:${currentMove[0]} row:${currentMove[1]} col:${currentMove[2]}` : ''}
                </button>
              }

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
    };

    this.jumpTo = this.jumpTo.bind(this);
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

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).value : '';
    this.state.winningCoord = calculateWinner(current.squares) ? calculateWinner(current.squares).coord : [];
    console.log('winning coord:', this.state.winningCoord)

    const flipOrder = function () {
      console.log('hi')
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
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningCoord={this.state.winningCoord}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {<Turns stepNumber={this.state.stepNumber}
            history={this.state.history}
            isOrderDesc={this.state.isOrderDesc}
            jumpTo={this.jumpTo}
          />}
        </div>
        <button onClick={flipOrder}>FLIP</button>
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

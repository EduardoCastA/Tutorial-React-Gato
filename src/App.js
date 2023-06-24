import { useState } from 'react';

function Square({ value, onSquareClick }) {

	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay }) {

	const boardSquares = [];
	const winner = calculateWinner(squares);
  	let status;
  
	if(winner) {
    	status = "Ganador: " + winner;
  	} else {
		if(squares.includes(null)){
			status = "Siguiente jugador: " + (xIsNext ? "X" : "O");
		} else {
			status = "Fin del juego - Empate";
		}
  	}

	function handleClick(i) {
		if(squares[i] || calculateWinner(squares)) {
			return;
		}

		const nextSquares = squares.slice();
		if(xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		onPlay(nextSquares);
	}

	for(let i = 0; i < 3; i++) {
		const row = [];
		for(let j = 0; j < 3; j++) {
			row.push(<Square key={j + i * 3} value={squares[j + i * 3]} onSquareClick={() => handleClick(j + i * 3)} />);
		}
		boardSquares.push(<div key={i} className="board-row">{row}</div>);
	  }

	return (
		<div>
			<div className="status">{status}</div>
			{boardSquares}
    	</div>
  	);
}

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

	for(let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}

	return null;
  }

export default function Game() {
	
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState(0);
	const [isAsc, setIsAsc] = useState(true);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];
	let order;

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	const moves = history.map((squares, move) => {
		let description;
		if(move > 0){
			if(move === currentMove)
				description= 'Estas en el movimiento #' + move;
			else
				description = 'Ir al movimiento #' + move;
		} else {
			if(move === currentMove)
				description = 'Estas en el inicio del juego'
			else
				description = 'Ir al inicio del juego';
		}
		
		return (
			<li key={move}>
				{ move === currentMove ? 
					(<span>{description}</span>) 
				: 
					(<button onClick={() => jumpTo(move)}>{description}</button>)
				}
			</li>
		);
	});

	if(isAsc){
		order = "Ordenar descendentemente"
	} else {
		order = "Ordenar ascendentemente"
	}

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<ol>
					<button onClick={() => setIsAsc(!isAsc)}>{order}</button>
					{ isAsc ? moves : moves.reverse()}
				</ol>
			</div>
		</div>
	);
}
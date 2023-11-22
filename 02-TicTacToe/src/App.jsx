import { useEffect, useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board'
import { WinnerModal } from './components/WinnerModal'
import { saveGameToStorage, resetGameStorage } from './logic/storage/index.js'



function App() {
  //const board = Array(9).fill(null);

  const [board, setBoard] = useState(() => {
    const boardToStorage = window.localStorage.getItem('board')
    return boardToStorage ? JSON.parse(boardToStorage) : Array(9).fill(null)

  });


  const [turn, setTurn] = useState(() => {
    const turnToStorage = window.localStorage.getItem('turn')
    return turnToStorage ? JSON.parse(turnToStorage) : TURNS.X
  })

  const [winner, setWinner] = useState(null) //null no hay ganador, false hay empate

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameStorage()
  }

  const updateBoard = (index) => {

    if (board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn

    console.log(newBoard)
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })


    //revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard)

    if (newWinner) {
      setWinner(newWinner)
      confetti()
    }
    else if (checkEndGame(newBoard)) {
      setWinner(false) //empate
    }
  }

  return <main className='board'>
    <h1>Tic Tac Toe</h1>

    <button onClick={resetGame}>Reset game</button>
    <section className='game'>
      {
        board.map((square, index) => {
          return (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
            >{square}</Square>
          )
        })
      }
    </section>

    <section className='turn'>
      <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
      <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
    </section>


    <WinnerModal resetGame={resetGame} winner={winner} />
  </main>
}

export default App

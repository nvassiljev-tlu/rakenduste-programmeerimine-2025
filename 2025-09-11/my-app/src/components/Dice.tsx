import { useState } from "react"

function Dice() {
  const [diceValue, setDiceValue] = useState(1)

  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1
    setDiceValue(newValue)
  }

  return (
    <div>
      <h2>Dice Game</h2>
      <p>Current Dice Value: {diceValue}</p>
      <button onClick={rollDice}>Roll Dice</button>
    </div>
  )
}

export default Dice

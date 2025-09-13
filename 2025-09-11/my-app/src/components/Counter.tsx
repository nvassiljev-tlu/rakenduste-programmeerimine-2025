import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  function increaseCounter(amount: number) {
    setCount(count => count + amount)
  }

  return (
    <>
      <h1>Vite + React + Nikita</h1>
      <p>Count is {count}</p>
      <div className="card">
        <button onClick={() => increaseCounter(100)}>Add 100</button>
        <button onClick={() => increaseCounter(50)}>Add 50</button>
        <button onClick={() => increaseCounter(25)}>Add 25</button>
        <button onClick={() => increaseCounter(1)}>Add 1</button>
        <button onClick={() => increaseCounter(-1)}>Subtract 1</button>
        <button onClick={() => increaseCounter(-25)}>Subtract 25</button>
        <button onClick={() => increaseCounter(-50)}>Subtract 50</button>
        <button onClick={() => increaseCounter(-100)}>Subtract 100</button>
      </div>
    </>
  )
}

export default Counter

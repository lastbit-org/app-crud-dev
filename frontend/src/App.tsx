import { useState } from 'react'


import './css/App.css'

function App() {
  const [data, setData] = useState("")


  const getData =async () => {

    const res = await fetch('http://localhost:8080/api/data')
    const response = await res.json()
    console.log(response)
    setData(response.message)

  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
        </div>
        <button
          className="counter"
          onClick={() => getData()}
        >
          Get Data
        </button>
      </section>

      <div className="ticks"></div>
      <section id="spacer">
        {data}
      </section>
    </>
  )
}

export default App

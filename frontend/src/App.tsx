import { useState } from 'react'


import './css/App.css'

function App() {
  const [data, setData] = useState("")


  const getData =async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const res = await fetch(`${baseUrl}/api/data`)
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

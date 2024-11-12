import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  function handleToggleModal () {
    setShowModal(!showModal)
  }
  
  //Onderstaande code werkt alsvolgt, als de requirements voor de array [] worden gesatisfyed dan gaat de code lopen, als deze leeg is begint het op page load, als er een variabele instaat gaat de functie pas lopen als de variabele veranderd. Wij willen een lege array want de functie moet lopen op page load
  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_KEY}`

      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`
      if(localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey))
        setData(apiData)
        console.log('Fetched from cache today')
        console.log(apiData)
        return
      }
      localStorage.clear()

      try {
        const res = await fetch(url)
        const apiData = await res.json()
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData)
        console.log('Fetched from API today')
        console.log(apiData)
      } catch(err) {
        console.log(err.message)
      }
    }
    fetchAPIData()
  }, [])

  return (
    <>
    {data ? (<Main data={data}/>): (
      <div className="loadingState">
        <i className="fa-solid fa-gear"></i>
      </div>
    )}
    { showModal && (
    <SideBar data={data} handleToggleModal={handleToggleModal} />
    )}
    {data && 
    (<Footer data={data} handleToggleModal={handleToggleModal} />
    )}    
    </>
  )
}

export default App

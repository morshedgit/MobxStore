import './App.css'
import {List } from "./Components/List"
import {carStore} from "./Models/Store"

function App() {
  

  return (
    <main>
      <List store={carStore}/>
    </main>
  )
}

export default App

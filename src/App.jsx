import { useState } from "react"
import Filter from "./components/Filter"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Issues from "./components/Issues"

const App = () => {
  const [checked, setChecked] = useState(false)
  return (
    <div className="">
      <div className="mx-5 flex flex-col justify-center items-center min-h-screen">
        <div className="w-full max-w-3xl flex flex-col gap-1">
          <Header />
          <Filter />
          <div className='mb-3 mt-2 flex items-center gap-2'>
            <label htmlFor="bookmark" className="text-sm text-zinc-200/80 opacity-90">View saved ones</label>
            <input className="ring-transparent" type="checkbox" name="bookmark" id="bookmark" onChange={() => setChecked(!checked)}/>
          </div>
          <Issues checked={checked}/>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
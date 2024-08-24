import Filter from "./components/Filter"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Issues from "./components/Issues"

const App = () => {
  return (
    <div className="mx-5" >
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-full max-w-3xl">
          <Header />
          <Filter />
          <Issues />
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
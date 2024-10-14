import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { IoFilter } from "react-icons/io5"

const Filter = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const minStars = searchParams.get("minStars")
  const maxStars = searchParams.get("maxStars")
  const lang = searchParams.get("language")

  const [language, setLanguage] = useState(lang)
  const [minValue, setMinValue] = useState(minStars || 0)
  const [maxValue, setMaxValue] = useState(maxStars || 100000)

  const [active, setActive] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    params.append('minStars', minValue);
    if (maxValue) params.append('maxStars', maxValue);
    params.append('language', language);
      
    navigate(`?${params.toString()}`)
  }
  
  return (
    <div className="relative">
      <form 
        className="hidden md:flex justify-between items-center border-b border-b-zinc-800 pb-2 drop-shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-1">
          <label htmlFor="stars">
            <p className="text-sm text-zinc-200/80">Stars</p>
            <div className="flex flex-row w-1/2">
              <input 
                type="number" 
                className="border w-24 rounded-md px-2 py-1 text-sm mr-0.5 bg-[#1c1c1c] border-zinc-800" 
                id="stars" 
                name="minStars" 
                value={minValue} 
                onChange={(e) => setMinValue(e.target.value)} 
              />
              <input 
                type="number" 
                className="border w-24 rounded-md px-2 py-1 text-sm mr-0.5 bg-[#1c1c1c] border-zinc-800" 
                id="stars" 
                name="maxStars" 
                value={maxValue} 
                onChange={(e) => setMaxValue(e.target.value)} 
              />
            </div>
          </label>
          <label htmlFor="language">
            <p className="text-sm text-zinc-200/95">Language</p>
            <input 
              className="border rounded-md px-2 py-1 text-sm bg-[#1c1c1c] border-zinc-800" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              type="text" 
              placeholder="e.g. javascript" 
              name="language" 
              id="language" 
            />
          </label>
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-zinc-100 px-4 py-1 text-sm rounded-xl"
        >
          Filter
        </button>
      </form>

      <div className="flex md:hidden justify-end">
        <div className="rounded-full flex items-center justify-center bg-blue-600 text-zinc-100 p-2.5 cursor-pointer" onClick={() => setActive(!active)}>
          <IoFilter className="w-4 h-4" />
        </div>
      </div>
      {
        active && (
          <div className="flex md:hidden justify-center items-center">
            <form className="flex flex-wrap justify-center items-end gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-wrap justify-center items-center gap-1">
                <label htmlFor="stars">
                  <p className="text-xs text-zinc-200/90">Stars</p>
                  <div className="flex flex-row w-1/2">
                    <input 
                      type="number" 
                      className="border w-20 rounded-md px-2 py-1 text-sm mr-0.5 bg-[#1c1c1c] border-zinc-800" 
                      id="minStars"
                      name="minStars" 
                      value={minValue} 
                      onChange={(e) => setMinValue(e.target.value)} 
                    />
                    <input 
                      type="number" 
                      className="border w-24 rounded-md px-2 py-1 text-sm mr-0.5 bg-[#1c1c1c] border-zinc-800" 
                      id="stars" 
                      name="maxStars"
                      value={maxValue} 
                      onChange={(e) => setMaxValue(e.target.value)} 
                    />
                  </div>
                </label>
                <label htmlFor="language">
                  <p className="text-xs text-zinc-200/90">Language</p>
                  <input 
                    className="border rounded-md px-2 py-1 text-sm bg-[#1c1c1c] border-zinc-800" 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    type="text" 
                    placeholder="e.g. javascript" 
                    name="language" 
                    id="language" 
                  />
                </label>
                {/*
                <label htmlFor="framework">
                  <p className="text-sm text-zinc-600">Framework/Library</p>
                  <input className="border w-auto rounded-md px-2 py-1 text-sm" value={framework} onChange={(e) => setFramework(e.target.value)} type="text" placeholder="e.g. reactjs, expressjs" name="framework" id="framework" />
                </label>                
                */}
              </div>

              <button 
                type="submit" 
                className="bg-blue-600 text-zinc-100 px-4 py-1 text-sm rounded-xl"
              >
                Filter
              </button>
            </form>

          </div>
        )
      }
    </div>
  )
}

export default Filter
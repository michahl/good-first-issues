import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

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
        className="hidden md:flex justify-between items-center border-b dark:border-b-zinc-600 pb-2 drop-shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-1">
          <label htmlFor="stars">
            <p className="text-sm text-zinc-600">Stars</p>
            <div className="flex flex-row w-1/2">
              <input 
                type="number" 
                className="border w-24 rounded-md px-2 py-1 text-sm mr-0.5 dark:text-zinc-200 dark:bg-stone-950 dark:border-zinc-800" 
                id="stars" 
                name="minStars" 
                value={minValue} 
                onChange={(e) => setMinValue(e.target.value)} 
              />
              <input 
                type="number" 
                className="border w-24 rounded-md px-2 py-1 text-sm mr-0.5 dark:text-zinc-200 dark:bg-stone-950 dark:border-zinc-800" 
                id="stars" 
                name="maxStars" 
                value={maxValue} 
                onChange={(e) => setMaxValue(e.target.value)} 
              />
            </div>
          </label>
          <label htmlFor="language">
            <p className="text-sm text-zinc-600">Language</p>
            <input 
              className="border rounded-md px-2 py-1 text-sm dark:text-zinc-200 dark:bg-stone-950 dark:border-zinc-800" 
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
            <input className="border rounded-md px-2 py-1 text-sm" value={framework} onChange={(e) => setFramework(e.target.value)} type="text" placeholder="e.g. reactjs, expressjs" name="framework" id="framework" />
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

      <div className="flex md:hidden justify-end">
        <div className="flex items-center justify-center rounded-lg bg-blue-600 text-zinc-100 px-3 py-2 cursor-pointer" onClick={() => setActive(!active)}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4.6C2 4.03995 2 3.75992 2.10899 3.54601C2.20487 3.35785 2.35785 3.20487 2.54601 3.10899C2.75992 3 3.03995 3 3.6 3H20.4C20.9601 3 21.2401 3 21.454 3.10899C21.6422 3.20487 21.7951 3.35785 21.891 3.54601C22 3.75992 22 4.03995 22 4.6V5.26939C22 5.53819 22 5.67259 21.9672 5.79756C21.938 5.90831 21.8901 6.01323 21.8255 6.10776C21.7526 6.21443 21.651 6.30245 21.4479 6.4785L15.0521 12.0215C14.849 12.1975 14.7474 12.2856 14.6745 12.3922C14.6099 12.4868 14.562 12.5917 14.5328 12.7024C14.5 12.8274 14.5 12.9618 14.5 13.2306V18.4584C14.5 18.6539 14.5 18.7517 14.4685 18.8363C14.4406 18.911 14.3953 18.9779 14.3363 19.0315C14.2695 19.0922 14.1787 19.1285 13.9971 19.2012L10.5971 20.5612C10.2296 20.7082 10.0458 20.7817 9.89827 20.751C9.76927 20.7242 9.65605 20.6476 9.58325 20.5377C9.5 20.4122 9.5 20.2142 9.5 19.8184V13.2306C9.5 12.9618 9.5 12.8274 9.46715 12.7024C9.43805 12.5917 9.39014 12.4868 9.32551 12.3922C9.25258 12.2856 9.15102 12.1975 8.94789 12.0215L2.55211 6.4785C2.34898 6.30245 2.24742 6.21443 2.17449 6.10776C2.10986 6.01323 2.06195 5.90831 2.03285 5.79756C2 5.67259 2 5.53819 2 5.26939V4.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
        </div>
      </div>
      {
        active && (
          <div className="flex md:hidden flex-wrap justify-center items-center">
            <form className="flex flex-col justify-center items-center gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-wrap justify-center items-center gap-1">
                <label htmlFor="stars">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Stars</p>
                  <div className="flex flex-row w-1/2">
                    <input 
                      type="number" 
                      className="border w-20 rounded-md px-2 py-1 text-sm mr-0.5 dark:text-zinc-200 dark:bg-stone-950 dark:border-zinc-800" 
                      id="minStars"
                      name="minStars" 
                      value={minValue} 
                      onChange={(e) => setMinValue(e.target.value)} 
                    />
                    <input 
                      type="number" 
                      className="border w-24 rounded-md px-2 py-1 text-sm mr-0.5 dark:text-zinc-200 dark:bg-stone-950 dark:border-zinc-800" 
                      id="stars" 
                      name="maxStars"
                      value={maxValue} 
                      onChange={(e) => setMaxValue(e.target.value)} 
                    />
                  </div>
                </label>
                <label htmlFor="language">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Language</p>
                  <input 
                    className="border rounded-md px-2 py-1 text-sm dark:text-zinc-200 dark:bg-stone-950 dark:border-zinc-800" 
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
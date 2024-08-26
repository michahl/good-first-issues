const Logo = ({ size }) => {
  return (
    <div>
        <h1 
            className={`${size} font-logo font-extrabold select-none dark:text-zinc-100`}
        >
            BugScout
        </h1>
    </div>
  )
}

export default Logo
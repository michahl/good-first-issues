import Github from './Github'
import Logo from './Logo'

const Footer = () => {
  return (
    <div className='relative mb-5'>
      <div className='bottom-0 flex flex-row items-center justify-between'>
          <div className='flex flex-col items-start'>
              <Logo size={'text-xl'}/>
              <p className='text-xs text-zinc-500'>Designed to help developers discover good first issues.</p>
          </div>
          <a href='https://github.com/michahl/bugscout' target='_blank'>
            <Github />
          </a>
      </div>

    </div>
  )
}

export default Footer
import { FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='relative mb-5'>
      <div className='bottom-0 flex flex-col items-center justify-center gap-1'>
          <a href='https://github.com/michahl/goodissues' target='_blank'>
            <FaGithub className='w-6 h-6 text-zinc-200 hover:text-zinc-50' />  
          </a>
          <div className='flex flex-col items-start'>
              <p className='text-xs text-zinc-500'>Designed to help developers discover good first issues.</p>
          </div>
      </div>

    </div>
  )
}

export default Footer
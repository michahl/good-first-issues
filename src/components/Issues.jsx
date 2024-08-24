import { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom"
import service from '../services/index'
import helper from '../services/helper';

const Issues = () => {
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [saved, setSaved] = useState(false)

    const [searchParams] = useSearchParams()

    const minStars = searchParams.get("minStars")
    const maxStars = searchParams.get("maxStars")
    const language = searchParams.get("language")
  
    useEffect(() => {
      const fetchIssues = async () => {
        const params = {
          minStars: minStars || 0,
          maxStars: maxStars || 100000,
          language: language === '' ? '' : language,
          isAssigned: false,
          cursor: null,
          hasPullRequests: false,
        };
  
        try {
          const data = await service(params);
          setIssues(data.issues);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchIssues();
    }, [])

  if(loading) return (
    <div className='flex items-center justify-center my-80'>
        <div className='flex flex-row gap-2'>
            <div className='w-4 h-4 rounded-full animate-bounce bg-blue-600'></div>
            <div className='w-4 h-4 rounded-full animate-bounce bg-blue-600 [animation-delay:-.3s]'></div>
            <div className='w-4 h-4 rounded-full animate-bounce bg-blue-600 [animation-delay:-.5s]'></div>
        </div>
    </div>
  )

  if(error !== null) return (
    <div className='my-60 flex items-center justify-center'>
        <div className='text-yellow-400 opacity-85 flex flex-col justify-center items-center'>
            <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>{error}</p>
        </div>
    </div>
  )

  return (
    <div className='my-5'>
        <div className='h-[520px] md:h-[600px] overflow-y-auto'>
        {
            issues.map(issue => (
                <div className='border rounded-xl mb-4 relative hover:shadow-lg transition-shadow ease-in-out duration-200' key={issue.id}>
                    <div className='w-full rounded-t-xl relative'>
                        <span onClick={() => setSaved(!saved)} className='flex justify-end items-center px-3 py-1 absolute right-1 top-2 cursor-pointer'>
                        {
                            !saved ? (
                                <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
                            ): (
                                <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M9 10.5L11 12.5L15.5 8M19 21V7.8C19 6.11984 19 5.27976 18.673 4.63803C18.3854 4.07354 17.9265 3.6146 17.362 3.32698C16.7202 3 15.8802 3 14.2 3H9.8C8.11984 3 7.27976 3 6.63803 3.32698C6.07354 3.6146 5.6146 4.07354 5.32698 4.63803C5 5.27976 5 6.11984 5 7.8V21L12 17L19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
                            )
                        }
                        </span>

                    </div>
                    <div className='px-4 py-3.5'>
                    <a href={issue.html_url} target='_blank' className='text-blue-600 text-xl font-semibold hover:underline'>{issue.title}</a>
                    <p className='text-sm text-zinc-500 mb-3'>{issue.repository_name}</p>
                    <div className='flex flex-wrap items-center text-sm text-slate-500'>
                        <div className='flex flex-row items-center space-x-0.5 mr-5'>
                            <svg className='w-3 h-3' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.2827 3.45332C11.5131 2.98638 11.6284 2.75291 11.7848 2.67831C11.9209 2.61341 12.0791 2.61341 12.2152 2.67831C12.3717 2.75291 12.4869 2.98638 12.7174 3.45332L14.9041 7.88328C14.9721 8.02113 15.0061 8.09006 15.0558 8.14358C15.0999 8.19096 15.1527 8.22935 15.2113 8.25662C15.2776 8.28742 15.3536 8.29854 15.5057 8.32077L20.397 9.03571C20.9121 9.11099 21.1696 9.14863 21.2888 9.27444C21.3925 9.38389 21.4412 9.5343 21.4215 9.68377C21.3988 9.85558 21.2124 10.0372 20.8395 10.4004L17.3014 13.8464C17.1912 13.9538 17.136 14.0076 17.1004 14.0715C17.0689 14.128 17.0487 14.1902 17.0409 14.2545C17.0321 14.3271 17.0451 14.403 17.0711 14.5547L17.906 19.4221C17.994 19.9355 18.038 20.1922 17.9553 20.3445C17.8833 20.477 17.7554 20.57 17.6071 20.5975C17.4366 20.6291 17.2061 20.5078 16.7451 20.2654L12.3724 17.9658C12.2361 17.8942 12.168 17.8584 12.0962 17.8443C12.0327 17.8318 11.9673 17.8318 11.9038 17.8443C11.832 17.8584 11.7639 17.8942 11.6277 17.9658L7.25492 20.2654C6.79392 20.5078 6.56341 20.6291 6.39297 20.5975C6.24468 20.57 6.11672 20.477 6.04474 20.3445C5.962 20.1922 6.00603 19.9355 6.09407 19.4221L6.92889 14.5547C6.95491 14.403 6.96793 14.3271 6.95912 14.2545C6.95132 14.1902 6.93111 14.128 6.89961 14.0715C6.86402 14.0076 6.80888 13.9538 6.69859 13.8464L3.16056 10.4004C2.78766 10.0372 2.60121 9.85558 2.57853 9.68377C2.55879 9.5343 2.60755 9.38389 2.71125 9.27444C2.83044 9.14863 3.08797 9.11099 3.60304 9.03571L8.49431 8.32077C8.64642 8.29854 8.72248 8.28742 8.78872 8.25662C8.84736 8.22935 8.90016 8.19096 8.94419 8.14358C8.99391 8.09006 9.02793 8.02113 9.09597 7.88328L11.2827 3.45332Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>{issue.stars_count}</p>
                        </div>
                        <div className='flex flex-row items-center space-x-0.5 mr-5'>
                            <p>{issue.language}</p>
                        </div>
                        <div className='flex flex-row items-center space-x-0.5 mr-5'>
                            <svg className='w-3 h-3' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>{helper.formatDate(issue.created_at)}</p>
                        </div>
                        <div className='flex flex-row items-center space-x-0.5 mr-5'>
                            <svg className='w-3 h-3' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 11L13.4059 3.40589C12.887 2.88703 12.6276 2.6276 12.3249 2.44208C12.0564 2.27759 11.7638 2.15638 11.4577 2.08289C11.1124 2 10.7455 2 10.0118 2L6 2M3 8.7L3 10.6745C3 11.1637 3 11.4083 3.05526 11.6385C3.10425 11.8425 3.18506 12.0376 3.29472 12.2166C3.4184 12.4184 3.59136 12.5914 3.93726 12.9373L11.7373 20.7373C12.5293 21.5293 12.9253 21.9253 13.382 22.0737C13.7837 22.2042 14.2163 22.2042 14.618 22.0737C15.0747 21.9253 15.4707 21.5293 16.2627 20.7373L18.7373 18.2627C19.5293 17.4707 19.9253 17.0747 20.0737 16.618C20.2042 16.2163 20.2042 15.7837 20.0737 15.382C19.9253 14.9253 19.5293 14.5293 18.7373 13.7373L11.4373 6.43726C11.0914 6.09136 10.9184 5.9184 10.7166 5.79472C10.5376 5.68506 10.3425 5.60425 10.1385 5.55526C9.90829 5.5 9.6637 5.5 9.17452 5.5H6.2C5.0799 5.5 4.51984 5.5 4.09202 5.71799C3.7157 5.90973 3.40973 6.21569 3.21799 6.59202C3 7.01984 3 7.57989 3 8.7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>{issue.labels.toString().replaceAll(',', ', ')}</p>
                        </div>
                        <div className='flex flex-row items-center space-x-0.5 mr-5'>
                            <svg className='w-3 h-3' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V13.5C21 14.8978 21 15.5967 20.7716 16.1481C20.4672 16.8831 19.8831 17.4672 19.1481 17.7716C18.5967 18 17.8978 18 16.5 18C16.0114 18 15.7671 18 15.5405 18.0535C15.2383 18.1248 14.9569 18.2656 14.7185 18.4645C14.5397 18.6137 14.3931 18.8091 14.1 19.2L12.64 21.1467C12.4229 21.4362 12.3143 21.5809 12.1812 21.6327C12.0647 21.678 11.9353 21.678 11.8188 21.6327C11.6857 21.5809 11.5771 21.4362 11.36 21.1467L9.9 19.2C9.60685 18.8091 9.46028 18.6137 9.2815 18.4645C9.04312 18.2656 8.76169 18.1248 8.45951 18.0535C8.23287 18 7.98858 18 7.5 18C6.10218 18 5.40326 18 4.85195 17.7716C4.11687 17.4672 3.53284 16.8831 3.22836 16.1481C3 15.5967 3 14.8978 3 13.5V7.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>{issue.comments_count}</p>
                        </div>
                    </div>
                    </div>
                </div>
            ))
        }
        </div>
        <div className='flex items-center justify-center'>
            <button className='mt-4 bg-blue-600 text-zinc-100 text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700'>Load more</button>
        </div>
    </div>
  )
}

export default Issues
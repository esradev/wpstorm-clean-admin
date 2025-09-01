import { __ } from '@wordpress/i18n'
import { useState, useEffect } from '@wordpress/element'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const decodeEntities = (html: string) => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}

interface Post {
  id: number
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  date_gmt: string
}

export default function NotificationCenter() {
  const [loading, setLoading] = useState(true)
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [unreadCount, setUnreadCount] = useState(Number(localStorage.getItem('abzarwpUnreadCount')))

  const markAllAsRead = () => {
    setUnreadCount(0)
    setTimeout(() => {
      localStorage.setItem('abzarwpUnreadCount', '0')
    }, 100)
  }

  // Fetch latest posts from an API using axios
  const fetchLatestPosts = async () => {
    const response = await fetch('https://abzarwp.com/wp-json/wp/v2/posts?per_page=5')
    const data = await response.json()
    // save data and date and unread to localStorage
    localStorage.setItem('abzarwpLatestPosts', JSON.stringify(data))
    localStorage.setItem('abzarwpLastFetch', Date.now().toString())
    return data
  }

  useEffect(() => {
    const lastFetch = localStorage.getItem('abzarwpLastFetch')
    const lastFetchDate = lastFetch ? new Date(parseInt(lastFetch, 10)) : null
    const currentDate = new Date()
    const diffInHours = lastFetchDate ? (currentDate.getTime() - lastFetchDate.getTime()) / (1000 * 60 * 60) : 25

    if (diffInHours > 24) {
      fetchLatestPosts().then((data) => {
        setLatestPosts(data)
        setUnreadCount(data.length)
        localStorage.setItem('abzarwpUnreadCount', data.length.toString())
        setLoading(false)
      })
      return
    }

    const cachedData = localStorage.getItem('abzarwpLatestPosts')
    if (cachedData) {
      const parsedData = JSON.parse(cachedData)
      setLatestPosts(parsedData)
      setUnreadCount(Number(localStorage.getItem('abzarwpUnreadCount')) || parsedData.length)
      setLoading(false)
    }
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">{unreadCount}</span>}
          <span className="sr-only">{__('Toggle notifications', ' wpstorm-clean-admin')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 left-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{__('Notifications', 'wpstorm-clean-admin')}</h2>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            {__('Mark all as read', 'wpstorm-clean-admin')}
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          {loading
            ? // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="block mb-4 last:mb-0 p-2 animate-pulse bg-gray-100 rounded">
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
                </div>
              ))
            : latestPosts.map((post) => (
                <div key={post.id} className="block mb-4 last:mb-0 p-2">
                  <h3 className="text-sm font-sans font-medium">{decodeEntities(post.title.rendered)}</h3>
                  <p>{decodeEntities(post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ''))}</p>
                  <span className="text-xs text-muted-foreground">{decodeEntities(post.date_gmt)}</span>
                  <Button variant="link" className="text-sm text-black block mt-2">
                    <a href={post.link} target="_blank" rel="noopener noreferrer hover:underline hover:text-primary">
                      {__('Read more', 'wpstorm-clean-admin')}
                    </a>
                  </Button>
                </div>
              ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

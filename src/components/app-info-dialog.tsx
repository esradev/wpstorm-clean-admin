import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { BadgeInfo, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Route {
  title: string
  infoDetails: string
  infoLink: {
    url: string
    title: string
  }
  list?: {
    title: string
    content: string
  }[]
}

const AppInfoDialog = ({ route }: { route: Route }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  return (
    <>
      <div>
        <Button onClick={() => setIsInfoOpen(!isInfoOpen)} variant="outline" size="sm">
          <BadgeInfo className="h-4 w-4" /> {__('Section doc', 'wpstorm-clean-admin')}
        </Button>
      </div>
      {isInfoOpen && (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute left-0 top-0 hidden pl-4 pt-4 sm:block">
                  <button type="button" onClick={() => setIsInfoOpen(!isInfoOpen)} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-100 sm:mx-0 sm:h-10 sm:w-10">
                    <BadgeInfo className="h-6 w-6 text-fuchsia-600" />
                  </div>
                  <div className="mt-3 text-center sm:mr-4 sm:mt-0 sm:text-right">
                    <h3 className="text-base font-sans font-semibold leading-6 text-gray-900" id="modal-title">
                      {route?.title}
                    </h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p className="mb-2">{route?.infoDetails}</p>
                      <a href={route?.infoLink.url} className="text-fuchsia-600 px-2 py-1 rounded-md hover:bg-fuchsia-100 hover:no-underline ease-in-out transition-all duration-500" target="_blank">
                        {route?.infoLink.title}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-2 divide-y-2  space-y-4">
                  {route?.list?.length &&
                    route?.list?.map((route, index) => (
                      <div key={index} className="flex flex-col pt-2">
                        <h4 className="text-sm font-semibold text-gray-700">{route?.title}</h4>
                        <p className="text-sm text-gray-500">{route?.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AppInfoDialog

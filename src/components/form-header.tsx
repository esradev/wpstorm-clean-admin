import { Link } from 'react-router-dom'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import AppInfoDialog from './app-info-dialog'

export function FormHeader({ route, paramId }: { route: any; paramId?: string }) {
  return (
    <Card className="mb-6 font-sans shadow-sm">
      <CardHeader className="flex flex-row align-middle justify-between gap-4">
        <div className="flex flex-row align-middle gap-4">
          <route.icon className="w-10 h-10 rounded-full bg-gray-100 p-2 text-wpstorm-clean-admin-600" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{route?.title}</CardTitle>
              {route?.infoDetails && <AppInfoDialog route={route} />}
            </div>
            {route?.infoDetails && <CardDescription className="text-sm">{route?.infoDetails}</CardDescription>}
          </div>
        </div>
        {route?.linkTo && (
          <Link to={route?.linkTo.replace(':id', paramId || '')}>
            <Button variant="secondary" size="sm" className="flex flex-row align-middle gap-2">
              {route?.linkText} {route?.linkIcon && <route.linkIcon />}
            </Button>
          </Link>
        )}
      </CardHeader>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const NotFound: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex flex-col items-center gap-4">
            <SearchX className="w-16 h-16 text-primary" />
            <span className="text-2xl font-bold text-primary">{__('404', 'wpstorm-clean-admin')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{__('This page does not exist', 'wpstorm-clean-admin')}</h1>
          <p className="text-muted-foreground sm:text-lg">{__("Sorry, we couldn't find the page you're looking for.", 'wpstorm-clean-admin')}</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-x-1">
              <span aria-hidden="true">&larr;</span>
              {__('Back to home', 'wpstorm-clean-admin')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFound
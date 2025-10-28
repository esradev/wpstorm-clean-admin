import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccessDeniedProps {
  link?: string;
  title?: string;
  description?: string;
  backUrl?: string;
}

export default function AccessDenied({
  link,
  title = __('Access Denied', 'storm-clean-admin'),
  description = __(
    'You need to enable the following integrations to access this page:',
    'storm-clean-admin',
  ),
  backUrl = '/',
}: AccessDeniedProps) {
  // Add default icons if not provided
  const integrations = [
    {
      name: __('Plugin integration is off', 'storm-clean-admin'),
      description: __(
        'Enable the plugin integration to access this page',
        'storm-clean-admin',
      ),
      setupUrl: link,
      icon: <KeyRound className="h-5 w-5" />,
    },
  ];

  const integrationsWithIcons = integrations.map((integration) => ({
    ...integration,
    icon: integration.icon || <AlertCircle className="h-5 w-5" />,
  }));

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">
        <div className="flex justify-center mb-6">
          <div className="relative scale-in">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-background p-4 rounded-full border-2 border-destructive shadow-lg">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
          </div>
        </div>

        <Card className="w-full overflow-hidden border-2 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 bg-gradient-to-r from-destructive/10 to-background pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              {title}
            </CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {integrationsWithIcons.map((integration, index) => (
              <div
                key={index}
                className="group rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {integration.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold">{integration.name}</div>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                    <Link
                      to={integration.setupUrl}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline"
                    >
                      {__('Enable integration', 'storm-clean-admin')}
                      <ArrowLeft className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pb-6">
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              asChild
            >
              <Link to={integrations[0]?.setupUrl || '#'}>
                {__('Enable integration', 'storm-clean-admin')}
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to={backUrl}>{__('Go Back', 'storm-clean-admin')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

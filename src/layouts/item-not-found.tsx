import { Link } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ItemNotFoundProps {
  itemName: string;
  backLinkUrl: string;
}

const ItemNotFound: React.FC<ItemNotFoundProps> = ({
  itemName,
  backLinkUrl,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          <span className="text-base font-semibold text-primary">
            {__('404', 'storm-clean-admin')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-sans tracking-tight sm:text-5xl">
          {itemName + __(' not found', 'storm-clean-admin')}
        </h1>
        <p className="text-muted-foreground">
          {__("Sorry, we couldn't find the ", 'storm-clean-admin') +
            itemName +
            __(" you're looking for.", 'storm-clean-admin')}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-x-6">
        <Button asChild>
          <Link to={backLinkUrl}>{__('Go back', 'storm-clean-admin')}</Link>
        </Button>
        <Button variant="link" asChild>
          <a href="#" className="text-sm font-semibold">
            {__('Contact support', 'storm-clean-admin')}{' '}
            <span aria-hidden="true">&larr;</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemNotFound;

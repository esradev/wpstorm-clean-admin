import { __ } from '@wordpress/i18n';
import { BadgeAlert, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface AppActionDialogProps {
  title: string;
  desc: string;
  handleYes: () => void;
  handleCancel: () => void;
  handleClose: () => void;
}

const AppActionDialog: React.FC<AppActionDialogProps> = ({
  title,
  desc,
  handleYes,
  handleCancel,
  handleClose,
}) => {
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Card className="relative bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all">
            <CardHeader className="absolute left-0 top-0 hidden pl-4 pt-4 sm:block">
              <Button onClick={handleClose} variant="ghost">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                <BadgeAlert className="h-6 w-6 text-rose-600" />
              </div>
              <div className="mt-3 text-center sm:mr-4 sm:mt-0 sm:text-right">
                <h3
                  className="text-base font-sans font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-x-2">
              <Button onClick={handleYes} variant="destructive">
                {__('Yes', 'storm-clean-admin')}
              </Button>

              <Button
                onClick={handleCancel}
                variant="ghost"
                className="mt-3 sm:mt-0 sm:mr-3"
              >
                {__('Cancel', 'storm-clean-admin')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppActionDialog;

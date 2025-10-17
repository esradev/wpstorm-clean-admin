import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';
import { useFetch } from '@/hooks/use-fetch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useState } from '@wordpress/element';

interface user {
  id: number;
  username: string;
  email: string;
  roles: string[];
  last_login: string;
  registered: string;
}

export default function Dashboard() {
  const [chartDays, setChartDays] = useState(90);
  const { data, isFetching } = useFetch('users');
  const { data: statsData, isFetching: statsLoading } =
    useFetch('dashboard-stats');
  const { data: chartData, isFetching: chartLoading } = useFetch(
    `activity-chart?days=${chartDays}`,
  );

  const columns: ColumnDef<user>[] = [
    {
      accessorKey: 'username',
      header: __('Username', 'wpstorm-clean-admin'),
    },
    {
      accessorKey: 'email',
      header: __('Email', 'wpstorm-clean-admin'),
    },
    {
      accessorKey: 'roles',
      header: __('Roles', 'wpstorm-clean-admin'),
      cell: ({ row }) => row.original.roles.join(', '),
    },
    {
      accessorKey: 'last_login',
      header: __('Last Login', 'wpstorm-clean-admin'),
    },
    {
      accessorKey: 'registered',
      header: __('Registered', 'wpstorm-clean-admin'),
    },
    {
      id: 'actions',
      header: __('Actions', 'wpstorm-clean-admin'),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">
                  {__('Actions', 'wpstorm-clean-admin')}
                </span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {}}
                className="text-rose-600 hover:text-rose-900"
              >
                <Trash className="w-4 h-4 mr-2 inline" />
                {__('Delete', 'wpstorm-clean-admin')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex w-full h-full flex-col relative justify-between">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={statsData} loading={statsLoading} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              data={chartData}
              loading={chartLoading}
              onTimeRangeChange={(days) => setChartDays(days)}
            />
          </div>
          {!isFetching && (
            <DataTable
              columns={columns}
              data={data?.items}
              loading={isFetching}
            />
          )}
        </div>
      </div>
    </div>
  );
}

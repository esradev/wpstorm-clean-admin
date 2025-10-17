import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { __ } from '@wordpress/i18n';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';

export const description = 'An interactive area chart';

const chartConfig = {
  activity: {
    label: __('Activity', 'wpstorm-clean-admin'),
  },
  logins: {
    label: __('Logins', 'wpstorm-clean-admin'),
    color: 'var(--primary)',
  },
  registrations: {
    label: __('Registrations', 'wpstorm-clean-admin'),
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data?: Array<{
    date: string;
    logins: number;
    registrations: number;
  }>;
  loading?: boolean;
  onTimeRangeChange?: (days: number) => void;
}

export function ChartAreaInteractive({
  data,
  loading = false,
  onTimeRangeChange,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (onTimeRangeChange) {
      const daysMap: { [key: string]: number } = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
      };
      onTimeRangeChange(daysMap[value] || 90);
    }
  };

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>{__('User Activity', 'wpstorm-clean-admin')}</CardTitle>
          <CardDescription>
            {__('No activity data available yet', 'wpstorm-clean-admin')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            {__(
              'Start tracking user activity by enabling login tracking',
              'wpstorm-clean-admin',
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const today = new Date();
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{__('User Activity', 'wpstorm-clean-admin')}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {__(
              'Logins and registrations for the last 3 months',
              'wpstorm-clean-admin',
            )}
          </span>
          <span className="@[540px]/card:hidden">
            {__('Last 3 months', 'wpstorm-clean-admin')}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">
              {__('Last 3 months', 'wpstorm-clean-admin')}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d">
              {__('Last 30 days', 'wpstorm-clean-admin')}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d">
              {__('Last 7 days', 'wpstorm-clean-admin')}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label={__('Select a value', 'wpstorm-clean-admin')}
            >
              <SelectValue
                placeholder={__('Last 3 months', 'wpstorm-clean-admin')}
              />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {__('Last 3 months', 'wpstorm-clean-admin')}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {__('Last 30 days', 'wpstorm-clean-admin')}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {__('Last 7 days', 'wpstorm-clean-admin')}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-logins)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-logins)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillRegistrations"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="registrations"
              type="natural"
              fill="url(#fillRegistrations)"
              stroke="var(--color-registrations)"
              stackId="a"
            />
            <Area
              dataKey="logins"
              type="natural"
              fill="url(#fillLogins)"
              stroke="var(--color-logins)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

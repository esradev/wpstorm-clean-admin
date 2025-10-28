import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { __ } from '@wordpress/i18n';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionCardsProps {
  data?: {
    total_users: { value: number; change: number; trend: string };
    new_users: { value: number; change: number; trend: string };
    active_users: { value: number; change: number; trend: string };
    activity_rate: { value: number; change: number; trend: string };
  };
  loading?: boolean;
}

export function SectionCards({ data, loading = false }: SectionCardsProps) {
  if (loading || !data) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {__('Total Users', 'storm-clean-admin')}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.total_users.value.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.total_users.trend === 'up' ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {data.total_users.change > 0 ? '+' : ''}
              {data.total_users.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {__('All registered users', 'storm-clean-admin')}{' '}
            {data.total_users.trend === 'up' ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {__('Total users in the system', 'storm-clean-admin')}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {__('New Users This Month', 'storm-clean-admin')}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.new_users.value.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.new_users.trend === 'up' ? (
                <IconTrendingUp />
              ) : data.new_users.trend === 'down' ? (
                <IconTrendingDown />
              ) : null}
              {data.new_users.change > 0 ? '+' : ''}
              {data.new_users.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.new_users.trend === 'up'
              ? __('Growth in new registrations', 'storm-clean-admin')
              : data.new_users.trend === 'down'
              ? __('Decrease in registrations', 'storm-clean-admin')
              : __('Stable registrations', 'storm-clean-admin')}{' '}
            {data.new_users.trend === 'up' ? (
              <IconTrendingUp className="size-4" />
            ) : data.new_users.trend === 'down' ? (
              <IconTrendingDown className="size-4" />
            ) : null}
          </div>
          <div className="text-muted-foreground">
            {__('Compared to last month', 'storm-clean-admin')}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {__('Active Users (30 days)', 'storm-clean-admin')}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.active_users.value.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.active_users.trend === 'up' ? (
                <IconTrendingUp />
              ) : data.active_users.trend === 'down' ? (
                <IconTrendingDown />
              ) : null}
              {data.active_users.change > 0 ? '+' : ''}
              {data.active_users.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.active_users.trend === 'up'
              ? __('Strong user retention', 'storm-clean-admin')
              : data.active_users.trend === 'down'
              ? __('Declining activity', 'storm-clean-admin')
              : __('Stable activity', 'storm-clean-admin')}{' '}
            {data.active_users.trend === 'up' ? (
              <IconTrendingUp className="size-4" />
            ) : data.active_users.trend === 'down' ? (
              <IconTrendingDown className="size-4" />
            ) : null}
          </div>
          <div className="text-muted-foreground">
            {__('Users logged in last 30 days', 'storm-clean-admin')}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {__('Activity Rate', 'storm-clean-admin')}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.activity_rate.value}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.activity_rate.trend === 'up' ? (
                <IconTrendingUp />
              ) : data.activity_rate.trend === 'down' ? (
                <IconTrendingDown />
              ) : null}
              {data.activity_rate.change > 0 ? '+' : ''}
              {data.activity_rate.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.activity_rate.trend === 'up'
              ? __('Increasing engagement', 'storm-clean-admin')
              : data.activity_rate.trend === 'down'
              ? __('Declining engagement', 'storm-clean-admin')
              : __('Steady engagement', 'storm-clean-admin')}{' '}
            {data.activity_rate.trend === 'up' ? (
              <IconTrendingUp className="size-4" />
            ) : data.activity_rate.trend === 'down' ? (
              <IconTrendingDown className="size-4" />
            ) : null}
          </div>
          <div className="text-muted-foreground">
            {__('Active vs total users ratio', 'storm-clean-admin')}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

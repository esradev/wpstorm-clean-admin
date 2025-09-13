import type React from 'react';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  filterOptions?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  onRowClick?: (row: TData) => void;
  bulkActions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (selectedRows: TData[]) => void;
    variant?: 'default' | 'destructive';
  }[];
  emptyState?: {
    title: string;
    description: string;
    icons?: React.ComponentType<{ className?: string }>[];
  };
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  defaultSorting?: SortingState;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchKey,
  searchPlaceholder = 'Search...',
  filterOptions = [],
  onRowClick,
  bulkActions = [],
  emptyState = {
    title: 'No Results',
    description: 'No data available to display.',
  },
  enableRowSelection = true,
  enableColumnVisibility = true,
  defaultSorting = [],
  className = '',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Add selection column if enabled
  const tableColumns = enableRowSelection
    ? [
        {
          id: 'select',
          header: ({ table }: any) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }: any) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              onClick={(e) => e.stopPropagation()}
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getSelectedRows = () => {
    console.log(rowSelection);
    return Object.keys(rowSelection).map(
      (index) => data[Number.parseInt(index)],
    );
  };

  const selectedCount = Object.keys(rowSelection)?.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Search Input */}
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}

          {/* Filter Dropdowns */}
          {filterOptions.map((filter) => (
            <DropdownMenu key={filter.key} modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-[180px] bg-transparent"
                >
                  {filter.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() =>
                    table.getColumn(filter.key)?.setFilterValue('')
                  }
                >
                  All
                </DropdownMenuItem>
                {filter.options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      table.getColumn(filter.key)?.setFilterValue(option.value)
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {enableRowSelection &&
            selectedCount > 0 &&
            bulkActions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedCount} selected
                </span>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {bulkActions.map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => action.onClick(getSelectedRows())}
                        className={
                          action.variant === 'destructive'
                            ? 'text-destructive focus:text-destructive'
                            : ''
                        }
                      >
                        {action.icon && (
                          <action.icon className="mr-2 h-4 w-4" />
                        )}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize"
                        onClick={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      >
                        <Checkbox
                          checked={column.getIsVisible()}
                          className="mr-2"
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        />
                        {column.id}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-right last:text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={tableColumns?.length}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`${
                      onRowClick ? 'cursor-pointer' : ''
                    } last:text-left text-right`}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="pl-0 pr-2 last:text-left text-right"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns?.length}
                  className="h-64 text-center"
                >
                  <EmptyState
                    title={emptyState.title}
                    description={emptyState.description}
                    icons={emptyState.icons}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows?.length} of{' '}
          {table.getCoreRowModel().rows?.length} record(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {__('Previous', 'payamito-plus')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {__('Next', 'payamito-plus')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to create sortable header
export function createSortableHeader(label: string) {
  return ({ column }: any) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };
}

// Helper function to create action column
export function createActionColumn<T>(
  actions: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (row: T) => void;
    variant?: 'default' | 'destructive';
    show?: (row: T) => boolean;
  }[],
) {
  return {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => {
      const data = row.original as T;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {actions.map((action, index) => {
              if (action.show && !action.show(data)) return null;

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(data)}
                  className={
                    action.variant === 'destructive'
                      ? 'text-destructive focus:text-destructive'
                      : ''
                  }
                >
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

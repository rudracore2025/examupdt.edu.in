import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  mobileLabel?: string; // For mobile view labels
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  itemsPerPage?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  mobileCardRender?: (item: T, columns: Column<T>[]) => React.ReactNode; // Custom mobile card renderer
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  onSearch,
  itemsPerPage = 10,
  isLoading = false,
  emptyMessage = 'No data available',
  mobileCardRender,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  let processedData = [...data];

  // Apply search filter
  if (searchQuery && !onSearch) {
    processedData = processedData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  // Apply sorting
  if (sortConfig) {
    processedData.sort((a, b) => {
      const aValue = String((a as any)[sortConfig.key]);
      const bValue = String((b as any)[sortConfig.key]);
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = processedData.slice(startIndex, endIndex);

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-[#0A0A0A]/40" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-[#004AAD]" />
    ) : (
      <ArrowDown className="w-4 h-4 text-[#004AAD]" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#004AAD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0A0A0A]/60">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full overflow-hidden">
      {/* Search and Filters */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/40" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-full sm:w-[140px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F5F5F5] border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs text-[#0A0A0A]/60 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-[#004AAD] transition-colors"
                    >
                      <span className="truncate">{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span className="truncate">{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F5F5] transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-[#0A0A0A]">
                      {column.render ? column.render(item) : String((item as any)[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-[#0A0A0A]/60">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible on mobile only */}
      <div className="md:hidden divide-y divide-gray-200">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div key={item.id} className="p-4">
              {mobileCardRender ? (
                mobileCardRender(item, columns)
              ) : (
                <div className="space-y-3">
                  {columns.filter(col => col.key !== 'actions').map((column) => (
                    <div key={column.key} className="flex justify-between items-start gap-2">
                      <span className="text-xs text-[#0A0A0A]/60 uppercase tracking-wider flex-shrink-0">
                        {column.mobileLabel || column.label}:
                      </span>
                      <div className="text-sm text-[#0A0A0A] text-right flex-1 min-w-0">
                        {column.render ? column.render(item) : String((item as any)[column.key])}
                      </div>
                    </div>
                  ))}
                  {/* Actions at bottom if exists */}
                  {columns.find(col => col.key === 'actions') && (
                    <div className="pt-2 border-t border-gray-200 flex gap-2 justify-end">
                      {columns.find(col => col.key === 'actions')?.render?.(item)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-[#0A0A0A]/60 text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginatedData.length > 0 && totalPages > 1 && (
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-[#0A0A0A]/60 text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)} of{' '}
              {processedData.length} results
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <div className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#0A0A0A] whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
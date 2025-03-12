import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { Input } from './input';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  isLoading,
  pageSize = 10,
  searchable,
  onSearch,
  serverSide = false,
  totalRows = 0,
  currentPage = 1,
  onPageChange,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle local sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || serverSide) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Handle local pagination
  const paginatedData = React.useMemo(() => {
    if (serverSide) return sortedData;

    const startIndex = (localCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, localCurrentPage, pageSize]);

  const totalPages = serverSide 
    ? Math.ceil(totalRows / pageSize)
    : Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!serverSide) {
      setSortConfig(config => ({
        key,
        direction: 
          config.key === key && config.direction === 'asc' 
            ? 'desc' 
            : 'asc',
      }));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handlePageChange = (newPage) => {
    if (serverSide) {
      onPageChange(newPage);
    } else {
      setLocalCurrentPage(newPage);
    }
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronsUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="w-full">
        {searchable && (
          <div className="mb-4">
            <Input
              placeholder="Search..."
              className="max-w-sm"
              disabled
            />
          </div>
        )}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={column.sortable ? 'cursor-pointer' : ''}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length}
                className="text-center h-24 text-gray-500"
              >
                No results found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render 
                      ? column.render(row)
                      : getNestedValue(row, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Page {serverSide ? currentPage : localCurrentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(
                serverSide ? currentPage - 1 : localCurrentPage - 1
              )}
              disabled={(serverSide ? currentPage : localCurrentPage) === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(
                serverSide ? currentPage + 1 : localCurrentPage + 1
              )}
              disabled={(serverSide ? currentPage : localCurrentPage) === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
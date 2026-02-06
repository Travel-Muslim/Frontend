import React from 'react';
import Button from '../ui/button/Button';

// Action Button Icons
function IconEye() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export interface TableColumn {
  key: string;
  label: string;
  width?: string; // untuk grid-template-columns
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  type: 'view' | 'edit' | 'delete' | 'custom';
  label: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'orange' | 'red' | 'green' | 'purple';
  onClick: (row: any) => void;
  show?: (row: any) => boolean; // conditional rendering
}

interface AdminTableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  loading?: boolean;
  emptyMessage?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

export default function AdminTable({
  title,
  columns,
  data,
  actions = [],
  loading = false,
  emptyMessage = 'Belum ada data',
  searchValue = '',
  onSearch,
  searchPlaceholder = 'Cari data...',
  onAdd,
  addButtonText = 'Tambahkan Data',
  className = '',
}: AdminTableProps) {
  // Generate grid template for columns
  const gridTemplate = columns.map(col => col.width || '1fr').join(' ') + (actions.length > 0 ? ' 1fr' : '');

  const getActionButtonClass = (color: string = 'blue') => {
    const baseClass = 'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200';
    switch (color) {
      case 'blue':
        return `${baseClass} bg-[#60d2ff] hover:bg-[#4cc5f5] text-white`;
      case 'orange':
        return `${baseClass} bg-[#ff9f43] hover:bg-[#ff8a25] text-white`;
      case 'red':
        return `${baseClass} bg-[#ff6b6b] hover:bg-[#ff5252] text-white`;
      case 'green':
        return `${baseClass} bg-[#51cf66] hover:bg-[#40c057] text-white`;
      case 'purple':
        return `${baseClass} bg-[#b28be2] hover:bg-[#a374dc] text-white`;
      default:
        return `${baseClass} bg-[#60d2ff] hover:bg-[#4cc5f5] text-white`;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <IconEye />;
      case 'edit':
        return <IconEdit />;
      case 'delete':
        return <IconDelete />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-[0_18px_38px_rgba(15,23,42,0.12)] border border-[#f0e8ff] ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          {onSearch && (
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}

          {/* Add Button */}
          {onAdd && (
            <Button
              variant='light-teal-hover-dark-teal'
              onClick={onAdd}
              className="flex items-center gap-2 px-4 !h-10 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        {/* Header */}
        <div
          className="grid items-center bg-gradient-to-r from-[#b28be2] to-[#caa8f3] text-white font-bold px-4 py-3 rounded-t-lg"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((column) => (
            <div key={column.key} className="text-sm">
              {column.label}
            </div>
          ))}
          {actions.length > 0 && <div className="text-sm text-center">Aksi</div>}
        </div>

        {/* Body */}
        <div className="bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <span>Memuat data...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-l border-r border-b border-gray-200 rounded-b-lg">
              {emptyMessage}
            </div>
          ) : (
            data.map((row, index) => (
              <div
                key={row.id || index}
                className={`grid items-center px-4 py-3 border-l border-r border-gray-200 hover:bg-purple-50 transition-colors ${
                  index === data.length - 1 ? 'border-b rounded-b-lg' : 'border-b'
                }`}
                style={{ gridTemplateColumns: gridTemplate }}
              >
                {columns.map((column) => (
                  <div key={column.key} className="text-sm text-gray-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key] || '-'}
                  </div>
                ))}
                
                {actions.length > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    {actions
                      .filter(action => !action.show || action.show(row))
                      .map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={getActionButtonClass(action.color)}
                          title={action.label}
                        >
                          {action.icon || getActionIcon(action.type)}
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
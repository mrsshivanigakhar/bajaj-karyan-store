'use client';

import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, Loader2, Check } from 'lucide-react';

interface AdminReportToolbarProps {
  title?: string;
  subtitle?: string;
  totalCount: number;
  filteredCount?: number;
  onExportPdf: (scope: 'filtered' | 'all') => Promise<void> | void;
  onExportExcel: (scope: 'filtered' | 'all') => Promise<void> | void;
  compact?: boolean;
}

export function AdminReportToolbar({
  title = 'Reports & Export',
  subtitle = 'Download reports in PDF or formatted Excel spreadsheet',
  totalCount,
  filteredCount,
  onExportPdf,
  onExportExcel,
  compact = false,
}: AdminReportToolbarProps) {
  const [scope, setScope] = useState<'filtered' | 'all'>('filtered');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [justExported, setJustExported] = useState<string | null>(null);

  const hasFilter = filteredCount !== undefined && filteredCount !== totalCount;
  const activeCount = hasFilter && scope === 'filtered' ? filteredCount : totalCount;

  const handlePdf = async () => {
    setIsExportingPdf(true);
    try {
      await onExportPdf(hasFilter ? scope : 'all');
      setJustExported('pdf');
      setTimeout(() => setJustExported(null), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setIsExportingExcel(true);
    try {
      await onExportExcel(hasFilter ? scope : 'all');
      setJustExported('excel');
      setTimeout(() => setJustExported(null), 3000);
    } catch (err) {
      console.error('Excel export error:', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePdf}
          disabled={isExportingPdf || isExportingExcel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-[#800f2f] text-xs font-bold transition disabled:opacity-50 shadow-2xs"
          title="Download PDF Report"
        >
          {isExportingPdf ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-rose-600" />
          )}
          <span>PDF</span>
        </button>

        <button
          type="button"
          onClick={handleExcel}
          disabled={isExportingPdf || isExportingExcel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition disabled:opacity-50 shadow-2xs"
          title="Download Excel Spreadsheet"
        >
          {isExportingExcel ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>Excel</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-amber-50/30 border border-rose-100/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title & Description */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#800f2f] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-bold text-[#590d22]">{title}</h4>
              <span className="text-[11px] font-medium bg-white/90 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200/60 shadow-2xs">
                {activeCount} {activeCount === 1 ? 'record' : 'records'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Controls & Export buttons */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
          {/* Scope Selector if filtered */}
          {hasFilter && (
            <div className="flex items-center bg-white rounded-xl p-0.5 border border-rose-200 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setScope('filtered')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  scope === 'filtered'
                    ? 'bg-[#800f2f] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Filtered ({filteredCount})
              </button>
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  scope === 'all'
                    ? 'bg-[#800f2f] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({totalCount})
              </button>
            </div>
          )}

          {/* PDF Button */}
          <button
            type="button"
            onClick={handlePdf}
            disabled={isExportingPdf || isExportingExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-[#800f2f] text-xs font-bold transition disabled:opacity-50 shadow-2xs hover:shadow-xs"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
            ) : justExported === 'pdf' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>{isExportingPdf ? 'Exporting...' : 'PDF Report'}</span>
          </button>

          {/* Excel Button */}
          <button
            type="button"
            onClick={handleExcel}
            disabled={isExportingPdf || isExportingExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition disabled:opacity-50 shadow-2xs hover:shadow-xs"
          >
            {isExportingExcel ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            ) : justExported === 'excel' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{isExportingExcel ? 'Exporting...' : 'Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

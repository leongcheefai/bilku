'use client'

import { Download, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, type InvoiceHistory } from '@/lib/invoice-types'

interface MobileHistoryProps {
  history: InvoiceHistory[]
  onOpenProfile: () => void
}

export function MobileHistory({ history, onOpenProfile }: MobileHistoryProps) {
  return (
    <div className="p-4 bg-zinc-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">BilKu</span>
            <p className="text-xs text-gray-500">Invoice History</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenProfile}
        >
          <Settings className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        {history.map((invoice) => (
          <div
            key={invoice.invoiceNumber}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{invoice.invoiceNumber}</p>
              <p className="text-xs text-gray-500 truncate">{invoice.client}</p>
              <p className="text-xs text-gray-400">{invoice.date}</p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="text-sm font-bold text-orange-600">
                  RM {formatCurrency(invoice.total)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Download className="h-4 w-4 text-gray-400 hover:text-orange-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No invoices yet</p>
          <p className="text-sm text-gray-400">Create your first invoice to get started</p>
        </div>
      )}
    </div>
  )
}

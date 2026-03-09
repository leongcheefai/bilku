'use client'

import { FileText, Plus, Download, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, type InvoiceHistory } from '@/lib/invoice-types'

interface SidebarProps {
  history: InvoiceHistory[]
  onNewInvoice: () => void
  onOpenProfile: () => void
}

export function Sidebar({ history, onNewInvoice, onOpenProfile }: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">InvoisKu</h1>
            <p className="text-xs text-gray-400">SST invoices in 60s</p>
          </div>
        </div>
      </div>

      {/* New Invoice Button */}
      <div className="p-4">
        <Button
          onClick={onNewInvoice}
          className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Recent Invoices */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Recent
        </p>
        <div className="space-y-1">
          {history.map((invoice) => (
            <div
              key={invoice.invoiceNumber}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 cursor-pointer group transition-colors duration-150"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-gray-300">{invoice.invoiceNumber}</p>
                <p className="text-xs text-gray-500 truncate">
                  {invoice.client} · {invoice.date}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs font-semibold text-white">
                  RM {formatCurrency(invoice.total)}
                </span>
                <Download className="h-3.5 w-3.5 text-gray-600 group-hover:text-orange-400 transition-colors duration-150 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Profile */}
      <div className="mt-auto border-t border-gray-800 p-3">
        <button
          onClick={onOpenProfile}
          className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-sm text-gray-300 transition-colors duration-150 cursor-pointer"
        >
          <Settings className="h-4 w-4 text-gray-500" />
          Business Profile
        </button>
      </div>
    </aside>
  )
}

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  type LineItem,
  type Client,
  type InvoiceMeta,
  type BusinessProfile,
  INVOICE_LABELS,
  formatDate,
  formatCurrency,
  calculateTotals,
} from '@/lib/invoice-types'

const A4_WIDTH_PX = 793.7 // 210mm in px at 96dpi
const PADDING_PX = 48 // px-6 = 24px each side

interface InvoicePreviewProps {
  client: Client
  meta: InvoiceMeta
  items: LineItem[]
  businessProfile: BusinessProfile
}

const LABELS = INVOICE_LABELS

export function InvoicePreview({
  client,
  meta,
  items,
  businessProfile,
}: InvoicePreviewProps) {
  const hasSstRegistration = Boolean(businessProfile.sstRegistrationNo)
  const { subtotal, sstAmount, total } = calculateTotals(
    items,
    hasSstRegistration,
    client.isOverseas
  )

  const lang = meta.language === 'bm' ? 'bm' : 'en'
  const labels = LABELS[lang]
  const showBoth = meta.language === 'both'

  const accentColor = businessProfile.accentColor || '#f97316'

  const containerRef = useRef<HTMLDivElement>(null)
  const [autoZoom, setAutoZoom] = useState(0.56)
  const [zoomOffset, setZoomOffset] = useState(0)
  const zoom = Math.max(0.2, Math.min(1.5, autoZoom + zoomOffset))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width - PADDING_PX
        setAutoZoom(Math.max(0.2, Math.min(1.0, width / A4_WIDTH_PX)))
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const zoomIn = useCallback(() => setZoomOffset((o) => Math.min(o + 0.1, 0.5)), [])
  const zoomOut = useCallback(() => setZoomOffset((o) => Math.max(o - 0.1, -0.4)), [])
  const zoomReset = useCallback(() => setZoomOffset(0), [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      if (e.deltaY < 0) zoomIn()
      else zoomOut()
    }
  }, [zoomIn, zoomOut])

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          Live Preview
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoomOffset <= -0.4}
            aria-label="Zoom out"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
          >
            −
          </button>
          <button
            onClick={zoomReset}
            aria-label={`Reset zoom (currently ${Math.round(zoom * 100)}%)`}
            className="px-2 h-7 flex items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none font-mono tabular-nums min-w-[3.5rem]"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomOffset >= 0.5}
            aria-label="Zoom in"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
          >
            +
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-auto px-6 pb-6" onWheel={handleWheel}>
        <div
          className="relative"
          style={{
            width: `calc(210mm * ${zoom})`,
            height: `calc(297mm * ${zoom})`,
            minHeight: `calc(297mm * ${zoom})`,
          }}
        >
          <div
            className="bg-white shadow-xl rounded-lg overflow-hidden"
            style={{
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          >
          {/* Orange Top Bar */}
          <div 
            className="h-3 w-full"
            style={{ backgroundColor: accentColor }}
          />

          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between mb-8">
              {/* Business Info */}
              <div>
                {businessProfile.logo ? (
                  <div className="w-24 h-12 mb-3 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    Logo
                  </div>
                ) : (
                  <div 
                    className="text-lg font-bold mb-1"
                    style={{ color: accentColor }}
                  >
                    {businessProfile.businessName || 'Your Business Name'}
                  </div>
                )}
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <p>{businessProfile.address}</p>
                  <p>{businessProfile.city}, {businessProfile.state}</p>
                  <p>{businessProfile.postcode}</p>
                  <p>{businessProfile.email}</p>
                  {businessProfile.registrationNo && (
                    <p>SSM: {businessProfile.registrationNo}</p>
                  )}
                  {businessProfile.sstRegistrationNo && (
                    <p>SST: {businessProfile.sstRegistrationNo}</p>
                  )}
                </div>
              </div>

              {/* Invoice Info */}
              <div className="text-right">
                <span
                  className="block text-2xl font-bold mb-3"
                  style={{ color: accentColor }}
                >
                  {labels.invoice}
                  {showBoth && <span className="text-gray-400"> / {LABELS.bm.invoice}</span>}
                </span>
                <div className="text-[11px] text-gray-600 space-y-1">
                  <p>
                    <span className="text-gray-400">{labels.no}:</span> {meta.invoiceNumber}
                  </p>
                  <p>
                    <span className="text-gray-400">{labels.date}:</span> {formatDate(meta.issueDate)}
                  </p>
                  <p>
                    <span className="text-gray-400">{labels.due}:</span> {formatDate(meta.dueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {labels.billTo}
                {showBoth && <span> / {LABELS.bm.billTo}</span>}
              </span>
              <div className="text-[11px] text-gray-700 space-y-0.5">
                <p className="font-semibold">{client.company || 'Client Company'}</p>
                <p>{client.name}</p>
                <p>{client.address}</p>
                <p>{client.city}, {client.postcode}</p>
                <p>{client.state}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full text-[11px]">
                <thead>
                  <tr 
                    className="text-white text-[10px] font-semibold"
                    style={{ backgroundColor: accentColor }}
                  >
                    <th className="text-left py-2 px-3 rounded-tl">
                      {labels.description}
                      {showBoth && <span className="font-normal"> / {LABELS.bm.description}</span>}
                    </th>
                    <th className="text-center py-2 px-2 w-14">
                      {labels.qty}
                    </th>
                    <th className="text-right py-2 px-3 w-24">
                      {labels.unitPrice}
                    </th>
                    <th className="text-right py-2 px-3 rounded-tr w-24">
                      {labels.amount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={index % 2 === 1 ? 'bg-gray-50' : ''}
                    >
                      <td className="py-2 px-3 text-gray-700">
                        {item.description || 'Item description'}
                        {item.isTaxable && hasSstRegistration && !client.isOverseas && (
                          <span className="text-gray-400"> *</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-2 px-3 text-right text-gray-700 font-mono">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700 font-mono">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-gray-600">
                    {labels.subtotal}:
                    {showBoth && <span className="text-gray-400"> / {LABELS.bm.subtotal}</span>}
                  </span>
                  <span className="text-gray-700 font-mono">RM {formatCurrency(subtotal)}</span>
                </div>
                {hasSstRegistration && (
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-gray-600">
                      {labels.servicesTax} ({client.isOverseas ? '0%' : '8%'}):
                    </span>
                    <span className={`font-mono ${client.isOverseas ? 'text-gray-500 italic' : 'text-gray-700'}`}>
                      RM {formatCurrency(sstAmount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-300 my-2"></div>
                <div className="flex justify-between py-1">
                  <span className="text-[12px] font-bold text-gray-700">
                    {labels.total}:
                  </span>
                  <span 
                    className="text-[12px] font-bold font-mono"
                    style={{ color: accentColor }}
                  >
                    RM {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {meta.showBankDetails && businessProfile.bankName && (
              <div className="mb-8">
                <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {labels.paymentDetails}
                  {showBoth && <span> / {LABELS.bm.paymentDetails}</span>}
                </span>
                <div className="text-[11px] text-gray-700 space-y-0.5">
                  <p>{businessProfile.bankName}</p>
                  <p>{businessProfile.accountName}</p>
                  <p>{businessProfile.accountNumber}</p>
                </div>
              </div>
            )}

            {/* Tax Note */}
            {hasSstRegistration && !client.isOverseas && items.some(item => item.isTaxable) && (
              <p className="text-[9px] text-gray-400 mb-4">
                {labels.taxNote}
                {showBoth && <span> / {LABELS.bm.taxNote}</span>}
              </p>
            )}

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-400 pt-4 border-t border-gray-100">
              <p>{labels.thankYou}</p>
              <p>{labels.computerGenerated}</p>
              <p className="mt-2" style={{ color: accentColor }}>bilku.praxor.dev</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

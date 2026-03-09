'use client'

import {
  type LineItem,
  type Client,
  type InvoiceMeta,
  type BusinessProfile,
  formatCurrency,
  calculateTotals,
} from '@/lib/invoice-types'

interface MobilePreviewProps {
  client: Client
  meta: InvoiceMeta
  items: LineItem[]
  businessProfile: BusinessProfile
}

const LABELS = {
  en: {
    invoice: 'INVOICE',
    billTo: 'BILL TO',
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    servicesTax: 'Service Tax',
    total: 'TOTAL',
    paymentDetails: 'PAYMENT DETAILS',
    taxNote: '* Subject to 8% Service Tax',
    thankYou: 'Thank you for your business.',
    computerGenerated: 'This is a computer-generated invoice.',
    no: 'No',
    date: 'Date',
    due: 'Due',
  },
  bm: {
    invoice: 'INVOIS',
    billTo: 'BIL KEPADA',
    description: 'Penerangan',
    qty: 'Kuantiti',
    unitPrice: 'Harga Unit',
    amount: 'Jumlah',
    subtotal: 'Jumlah Kecil',
    servicesTax: 'Cukai Perkhidmatan',
    total: 'JUMLAH',
    paymentDetails: 'BUTIRAN PEMBAYARAN',
    taxNote: '* Tertakluk kepada 8% Cukai Perkhidmatan',
    thankYou: 'Terima kasih atas urusan anda.',
    computerGenerated: 'Ini adalah invois yang dijana komputer.',
    no: 'No',
    date: 'Tarikh',
    due: 'Tamat Tempoh',
  },
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function MobilePreview({
  client,
  meta,
  items,
  businessProfile,
}: MobilePreviewProps) {
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

  return (
    <div className="p-4 bg-gray-100 min-h-full">
      <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider">
        Live Preview
      </p>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Orange Top Bar */}
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: accentColor }}
        />

        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between mb-6">
            {/* Business Info */}
            <div className="flex-1">
              <div 
                className="text-sm font-bold mb-1"
                style={{ color: accentColor }}
              >
                {businessProfile.businessName || 'Your Business Name'}
              </div>
              <div className="text-[9px] text-gray-600 space-y-0.5">
                <p>{businessProfile.address}</p>
                <p>{businessProfile.city}, {businessProfile.state}</p>
                <p>{businessProfile.email}</p>
                {businessProfile.sstRegistrationNo && (
                  <p>SST: {businessProfile.sstRegistrationNo}</p>
                )}
              </div>
            </div>

            {/* Invoice Info */}
            <div className="text-right">
              <h1 
                className="text-lg font-bold mb-2"
                style={{ color: accentColor }}
              >
                {labels.invoice}
              </h1>
              <div className="text-[9px] text-gray-600 space-y-0.5">
                <p>{labels.no}: {meta.invoiceNumber}</p>
                <p>{labels.date}: {formatDate(meta.issueDate)}</p>
                <p>{labels.due}: {formatDate(meta.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-4">
            <h2 className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {labels.billTo}
              {showBoth && <span> / {LABELS.bm.billTo}</span>}
            </h2>
            <div className="text-[9px] text-gray-700 space-y-0.5">
              <p className="font-semibold">{client.company || 'Client Company'}</p>
              <p>{client.name}</p>
              <p>{client.address}</p>
              <p>{client.city}, {client.postcode}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-4">
            <table className="w-full text-[9px]">
              <thead>
                <tr 
                  className="text-white text-[8px] font-semibold"
                  style={{ backgroundColor: accentColor }}
                >
                  <th className="text-left py-1.5 px-2">{labels.description}</th>
                  <th className="text-center py-1.5 px-1 w-10">{labels.qty}</th>
                  <th className="text-right py-1.5 px-2 w-16">{labels.amount}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={index % 2 === 1 ? 'bg-gray-50' : ''}
                  >
                    <td className="py-1.5 px-2 text-gray-700">
                      {item.description || 'Item'}
                      {item.isTaxable && hasSstRegistration && !client.isOverseas && (
                        <span className="text-gray-400"> *</span>
                      )}
                    </td>
                    <td className="py-1.5 px-1 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-1.5 px-2 text-right text-gray-700 font-mono">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-3 mb-4">
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-gray-600">{labels.subtotal}:</span>
              <span className="text-gray-700 font-mono">RM {formatCurrency(subtotal)}</span>
            </div>
            {hasSstRegistration && (
              <div className="flex justify-between text-[9px] mb-1">
                <span className="text-gray-600">
                  {labels.servicesTax} ({client.isOverseas ? '0%' : '8%'}):
                </span>
                <span className={`font-mono ${client.isOverseas ? 'text-gray-500 italic' : 'text-gray-700'}`}>
                  RM {formatCurrency(sstAmount)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-between">
              <span className="text-[10px] font-bold text-gray-700">{labels.total}:</span>
              <span 
                className="text-[10px] font-bold font-mono"
                style={{ color: accentColor }}
              >
                RM {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          {meta.showBankDetails && businessProfile.bankName && (
            <div className="mb-4">
              <h2 className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {labels.paymentDetails}
              </h2>
              <div className="text-[9px] text-gray-700 space-y-0.5">
                <p>{businessProfile.bankName}</p>
                <p>{businessProfile.accountName}</p>
                <p>{businessProfile.accountNumber}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-[8px] text-gray-400 pt-3 border-t border-gray-100">
            <p>{labels.thankYou}</p>
            <p className="mt-1" style={{ color: accentColor }}>invoisku.vercel.app</p>
          </div>
        </div>
      </div>
    </div>
  )
}

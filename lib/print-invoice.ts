import {
  type LineItem,
  type Client,
  type InvoiceMeta,
  type BusinessProfile,
  formatCurrency,
  calculateTotals,
} from './invoice-types'

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

export function printInvoice(
  businessProfile: BusinessProfile,
  client: Client,
  meta: InvoiceMeta,
  items: LineItem[]
) {
  const hasSstRegistration = Boolean(businessProfile.sstRegistrationNo)
  const { subtotal, sstAmount, total } = calculateTotals(items, hasSstRegistration, client.isOverseas)
  const lang = meta.language === 'bm' ? 'bm' : 'en'
  const labels = LABELS[lang]
  const showBoth = meta.language === 'both'
  const accentColor = businessProfile.accentColor || '#f97316'

  const itemRows = items.map((item, index) => `
    <tr style="background: ${index % 2 === 1 ? '#f9fafb' : 'transparent'}">
      <td style="padding: 8px 12px; color: #374151;">
        ${item.description || 'Item description'}${item.isTaxable && hasSstRegistration && !client.isOverseas ? ' <span style="color:#9ca3af">*</span>' : ''}
      </td>
      <td style="padding: 8px; text-align: center; color: #374151;">${item.quantity}</td>
      <td style="padding: 8px 12px; text-align: right; color: #374151; font-family: monospace;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 8px 12px; text-align: right; color: #374151; font-family: monospace;">${formatCurrency(item.quantity * item.unitPrice)}</td>
    </tr>
  `).join('')

  const sstRow = hasSstRegistration ? `
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 11px;">
      <span style="color: #4b5563;">${labels.servicesTax} (${client.isOverseas ? '0%' : '8%'}):</span>
      <span style="font-family: monospace; ${client.isOverseas ? 'color:#6b7280; font-style:italic' : 'color:#374151'}">RM ${formatCurrency(sstAmount)}</span>
    </div>
  ` : ''

  const paymentSection = meta.showBankDetails && businessProfile.bankName ? `
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
        ${labels.paymentDetails}${showBoth ? ` / ${LABELS.bm.paymentDetails}` : ''}
      </h2>
      <div style="font-size: 11px; color: #374151; line-height: 1.6;">
        <p style="margin: 0;">${businessProfile.bankName}</p>
        <p style="margin: 0;">${businessProfile.accountName}</p>
        <p style="margin: 0;">${businessProfile.accountNumber}</p>
      </div>
    </div>
  ` : ''

  const taxNote = hasSstRegistration && !client.isOverseas && items.some(item => item.isTaxable) ? `
    <p style="font-size: 9px; color: #9ca3af; margin-bottom: 16px;">
      ${labels.taxNote}${showBoth ? ` / ${LABELS.bm.taxNote}` : ''}
    </p>
  ` : ''

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${meta.invoiceNumber} - ${client.company || client.name}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div style="width: 210mm; min-height: 297mm; margin: 0 auto; background: white;">
    <!-- Accent bar -->
    <div style="height: 12px; background: ${accentColor};"></div>

    <div style="padding: 32px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
        <div>
          <div style="font-size: 18px; font-weight: 700; color: ${accentColor}; margin-bottom: 4px;">
            ${businessProfile.businessName || 'Your Business Name'}
          </div>
          <div style="font-size: 11px; color: #4b5563; line-height: 1.6;">
            <p>${businessProfile.address}</p>
            <p>${businessProfile.city}, ${businessProfile.state}</p>
            <p>${businessProfile.postcode}</p>
            <p>${businessProfile.email}</p>
            ${businessProfile.registrationNo ? `<p>SSM: ${businessProfile.registrationNo}</p>` : ''}
            ${businessProfile.sstRegistrationNo ? `<p>SST: ${businessProfile.sstRegistrationNo}</p>` : ''}
          </div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-size: 24px; font-weight: 700; color: ${accentColor}; margin-bottom: 12px;">
            ${labels.invoice}${showBoth ? `<span style="color:#9ca3af"> / ${LABELS.bm.invoice}</span>` : ''}
          </h1>
          <div style="font-size: 11px; color: #4b5563; line-height: 1.8;">
            <p><span style="color: #9ca3af;">${labels.no}:</span> ${meta.invoiceNumber}</p>
            <p><span style="color: #9ca3af;">${labels.date}:</span> ${formatDate(meta.issueDate)}</p>
            <p><span style="color: #9ca3af;">${labels.due}:</span> ${formatDate(meta.dueDate)}</p>
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
          ${labels.billTo}${showBoth ? ` / ${LABELS.bm.billTo}` : ''}
        </h2>
        <div style="font-size: 11px; color: #374151; line-height: 1.6;">
          <p style="font-weight: 600;">${client.company || 'Client Company'}</p>
          <p>${client.name}</p>
          <p>${client.address}</p>
          <p>${client.city}, ${client.postcode}</p>
          <p>${client.state}</p>
        </div>
      </div>

      <!-- Line Items -->
      <div style="margin-bottom: 32px;">
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
          <thead>
            <tr style="background: ${accentColor}; color: white; font-size: 10px; font-weight: 600;">
              <th style="text-align: left; padding: 8px 12px; border-radius: 4px 0 0 0;">
                ${labels.description}${showBoth ? `<span style="font-weight:normal"> / ${LABELS.bm.description}</span>` : ''}
              </th>
              <th style="text-align: center; padding: 8px; width: 56px;">${labels.qty}</th>
              <th style="text-align: right; padding: 8px 12px; width: 96px;">${labels.unitPrice}</th>
              <th style="text-align: right; padding: 8px 12px; border-radius: 0 4px 0 0; width: 96px;">${labels.amount}</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
        <div style="width: 256px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 11px;">
            <span style="color: #4b5563;">
              ${labels.subtotal}:${showBoth ? `<span style="color:#9ca3af"> / ${LABELS.bm.subtotal}</span>` : ''}
            </span>
            <span style="color: #374151; font-family: monospace;">RM ${formatCurrency(subtotal)}</span>
          </div>
          ${sstRow}
          <div style="border-top: 1px solid #d1d5db; margin: 8px 0;"></div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span style="font-size: 12px; font-weight: 700; color: #374151;">${labels.total}:</span>
            <span style="font-size: 12px; font-weight: 700; font-family: monospace; color: ${accentColor};">RM ${formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      ${paymentSection}
      ${taxNote}

      <!-- Footer -->
      <div style="text-align: center; font-size: 10px; color: #9ca3af; padding-top: 16px; border-top: 1px solid #f3f4f6;">
        <p>${labels.thankYou}</p>
        <p>${labels.computerGenerated}</p>
      </div>
    </div>
  </div>
</body>
</html>`

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  iframe.style.left = '-9999px'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) return
  doc.open()
  doc.write(html)
  doc.close()

  iframe.onload = () => {
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 1000)
  }
}

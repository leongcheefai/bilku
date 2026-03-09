export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  isTaxable: boolean
}

export interface BusinessProfile {
  businessName: string
  registrationNo: string
  sstRegistrationNo: string
  address: string
  city: string
  postcode: string
  state: string
  email: string
  phone: string
  bankName: string
  accountName: string
  accountNumber: string
  duitNowNumber: string
  accentColor: string
  invoicePrefix: string
  invoiceCounter: number
  defaultPaymentTerms: number
  defaultNotes: string
  logo: string | null
}

export interface Client {
  name: string
  company: string
  address: string
  city: string
  postcode: string
  state: string
  country: string
  email: string
  isOverseas: boolean
}

export interface InvoiceMeta {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  language: 'en' | 'bm' | 'both'
  notes: string
  showBankDetails: boolean
  showDuitNowQR: boolean
}

export interface Invoice {
  sender: BusinessProfile
  client: Client
  meta: InvoiceMeta
  items: LineItem[]
}

export interface InvoiceHistory {
  invoiceNumber: string
  client: string
  total: number
  date: string
}

export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Wilayah Persekutuan Kuala Lumpur',
  'Wilayah Persekutuan Labuan',
  'Wilayah Persekutuan Putrajaya',
] as const

export const MALAYSIAN_BANKS = [
  'Maybank',
  'CIMB Bank',
  'Public Bank',
  'RHB Bank',
  'Hong Leong Bank',
  'AmBank',
  'Bank Islam',
  'Bank Rakyat',
  'BSN',
  'Affin Bank',
  'Alliance Bank',
  'Standard Chartered',
  'HSBC',
  'OCBC',
  'UOB',
  'Other',
] as const

export const ACCENT_COLORS = [
  { name: 'Orange', value: '#f97316' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Black', value: '#111827' },
] as const

export const MOCK_BUSINESS_PROFILE: BusinessProfile = {
  businessName: 'Firsttofly Sdn Bhd',
  registrationNo: '202301012345',
  sstRegistrationNo: 'W-SS-0012-20240001',
  address: 'Unit 12-3A, Menara 1 Sentrum',
  city: 'Kuala Lumpur',
  postcode: '50470',
  state: 'Wilayah Persekutuan Kuala Lumpur',
  email: 'hello@firsttofly.com',
  phone: '+60 12-345 6789',
  bankName: 'Maybank',
  accountName: 'Firsttofly Sdn Bhd',
  accountNumber: '5642 1234 5678',
  duitNowNumber: '',
  accentColor: '#f97316',
  invoicePrefix: 'INV',
  invoiceCounter: 3,
  defaultPaymentTerms: 30,
  defaultNotes: 'Payment due within 30 days. Bank transfer preferred. Thank you for your business.',
  logo: null,
}

export const MOCK_CLIENT: Client = {
  name: 'Izzatul Husna binti Rashid',
  company: 'Acme Teknologi Sdn Bhd',
  address: 'Level 8, Menara KLCC, Jalan Ampang',
  city: 'Kuala Lumpur',
  postcode: '50088',
  state: 'Wilayah Persekutuan Kuala Lumpur',
  country: 'Malaysia',
  email: 'izzatul@acme.com.my',
  isOverseas: false,
}

export const MOCK_ITEMS: LineItem[] = [
  { id: '1', description: 'Web Application Development (Phase 1)', quantity: 1, unitPrice: 8000, isTaxable: true },
  { id: '2', description: 'UI/UX Design Services', quantity: 1, unitPrice: 3500, isTaxable: true },
  { id: '3', description: 'Domain Registration & Hosting (1 year)', quantity: 1, unitPrice: 500, isTaxable: false },
]

export const MOCK_HISTORY: InvoiceHistory[] = [
  { invoiceNumber: 'INV-2025-003', client: 'Acme Teknologi Sdn Bhd', total: 12920, date: '09 Mar 2025' },
  { invoiceNumber: 'INV-2025-002', client: 'TechVenture Malaysia Sdn Bhd', total: 5200, date: '01 Mar 2025' },
  { invoiceNumber: 'INV-2025-001', client: 'Kedai Runcit Pak Amin', total: 980, date: '15 Feb 2025' },
]

// Bilingual labels for invoice preview
export const INVOICE_LABELS = {
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
} as const

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function generateInvoiceNumber(prefix: string, counter: number): string {
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(counter).padStart(3, '0')}`
}

export function calculateTotals(
  items: LineItem[],
  hasSstRegistration: boolean,
  isOverseasClient: boolean
): {
  subtotal: number
  taxableAmount: number
  sstAmount: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxableAmount = items
    .filter((item) => item.isTaxable)
    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const sstRate = hasSstRegistration && !isOverseasClient ? 0.08 : 0
  const sstAmount = taxableAmount * sstRate
  const total = subtotal + sstAmount

  return { subtotal, taxableAmount, sstAmount, total }
}

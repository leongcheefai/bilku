'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sidebar } from '@/components/invoice/sidebar'
import { InvoiceForm } from '@/components/invoice/invoice-form'
import { InvoicePreview } from '@/components/invoice/invoice-preview'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { MobilePreview } from '@/components/invoice/mobile-preview'
import { MobileHistory } from '@/components/invoice/mobile-history'
import { BusinessProfileModal } from '@/components/invoice/business-profile-modal'
import {
  type Client,
  type InvoiceMeta,
  type LineItem,
  type BusinessProfile,
  MOCK_BUSINESS_PROFILE,
  MOCK_CLIENT,
  MOCK_ITEMS,
  MOCK_HISTORY,
  generateInvoiceNumber,
} from '@/lib/invoice-types'
import { printInvoice } from '@/lib/print-invoice'

function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString().split('T')[0]
}

export function InvoicePageClient() {
  // Business profile state
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(MOCK_BUSINESS_PROFILE)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  // Invoice state
  const [client, setClient] = useState<Client>(MOCK_CLIENT)
  const [meta, setMeta] = useState<InvoiceMeta>({
    invoiceNumber: generateInvoiceNumber(
      MOCK_BUSINESS_PROFILE.invoicePrefix,
      MOCK_BUSINESS_PROFILE.invoiceCounter
    ),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: addDays(new Date(), MOCK_BUSINESS_PROFILE.defaultPaymentTerms),
    currency: 'MYR',
    language: 'en',
    notes: MOCK_BUSINESS_PROFILE.defaultNotes,
    showBankDetails: true,
    showDuitNowQR: false,
  })
  const [items, setItems] = useState<LineItem[]>(MOCK_ITEMS)

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState('form')

  // History state
  const [history] = useState(MOCK_HISTORY)

  const handleNewInvoice = () => {
    const newCounter = businessProfile.invoiceCounter + 1
    setBusinessProfile({ ...businessProfile, invoiceCounter: newCounter })
    setClient({
      name: '',
      company: '',
      address: '',
      city: '',
      postcode: '',
      state: '',
      country: 'Malaysia',
      email: '',
      isOverseas: false,
    })
    setMeta({
      invoiceNumber: generateInvoiceNumber(businessProfile.invoicePrefix, newCounter),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: addDays(new Date(), businessProfile.defaultPaymentTerms),
      currency: 'MYR',
      language: 'en',
      notes: businessProfile.defaultNotes,
      showBankDetails: true,
      showDuitNowQR: false,
    })
    setItems([
      {
        id: String(Date.now()),
        description: '',
        quantity: 1,
        unitPrice: 0,
        isTaxable: Boolean(businessProfile.sstRegistrationNo),
      },
    ])
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Desktop Sidebar */}
      <Sidebar
        history={history}
        onNewInvoice={handleNewInvoice}
        onOpenProfile={() => setProfileModalOpen(true)}
        onDownload={() => printInvoice(businessProfile, client, meta, items)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">BilKu</h1>
              <p className="text-xs text-gray-500">SST invoices in 60s</p>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-gray-200 bg-white h-12">
              <TabsTrigger
                value="form"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none"
              >
                Form
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="mt-0 flex-1 overflow-y-auto">
              <InvoiceForm
                client={client}
                meta={meta}
                items={items}
                businessProfile={businessProfile}
                onClientChange={setClient}
                onMetaChange={setMeta}
                onItemsChange={setItems}
                onPreview={() => setMobileTab('preview')}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-0 flex-1 overflow-y-auto">
              <MobilePreview
                client={client}
                meta={meta}
                items={items}
                businessProfile={businessProfile}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0 flex-1 overflow-y-auto">
              <MobileHistory
                history={history}
                onOpenProfile={() => setProfileModalOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={55} minSize={30}>
              <InvoiceForm
                client={client}
                meta={meta}
                items={items}
                businessProfile={businessProfile}
                onClientChange={setClient}
                onMetaChange={setMeta}
                onItemsChange={setItems}
                onPreview={() => {}}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={45} minSize={25}>
              <InvoicePreview
                client={client}
                meta={meta}
                items={items}
                businessProfile={businessProfile}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>

      {/* Business Profile Modal */}
      <BusinessProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        profile={businessProfile}
        onProfileChange={setBusinessProfile}
      />
    </div>
  )
}

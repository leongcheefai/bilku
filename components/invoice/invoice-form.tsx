'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, Info, CheckCircle, Download, Eye, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  type LineItem,
  type Client,
  type InvoiceMeta,
  type BusinessProfile,
  MALAYSIAN_STATES,
  formatCurrency,
  calculateTotals,
} from '@/lib/invoice-types'
import { printInvoice } from '@/lib/print-invoice'

interface InvoiceFormProps {
  client: Client
  meta: InvoiceMeta
  items: LineItem[]
  businessProfile: BusinessProfile
  onClientChange: (client: Client) => void
  onMetaChange: (meta: InvoiceMeta) => void
  onItemsChange: (items: LineItem[]) => void
  onPreview: () => void
}

export function InvoiceForm({
  client,
  meta,
  items,
  businessProfile,
  onClientChange,
  onMetaChange,
  onItemsChange,
  onPreview,
}: InvoiceFormProps) {
  const hasSstRegistration = Boolean(businessProfile.sstRegistrationNo)
  const { subtotal, sstAmount, total } = calculateTotals(
    items,
    hasSstRegistration,
    client.isOverseas
  )

  const [downloadState, setDownloadState] = useState<'idle' | 'done'>('idle')

  const handleDownload = useCallback(() => {
    printInvoice(businessProfile, client, meta, items)
    setDownloadState('done')
    setTimeout(() => setDownloadState('idle'), 2000)
  }, [businessProfile, client, meta, items])

  const addLineItem = () => {
    const newItem: LineItem = {
      id: String(Date.now()),
      description: '',
      quantity: 1,
      unitPrice: 0,
      isTaxable: hasSstRegistration,
    }
    onItemsChange([...items, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number | boolean) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeLineItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* SST Status Banner */}
        {hasSstRegistration ? (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4">
            <CheckCircle className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-sky-700">
                SST Registered · {businessProfile.sstRegistrationNo}
              </p>
              <p className="text-xs text-sky-600 mt-0.5">
                8% Service Tax will be applied to taxable items
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Info className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Not SST Registered</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Service Tax will not be charged on this invoice
              </p>
            </div>
          </div>
        )}

        {/* Section 1 - Invoice Meta */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Invoice Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Invoice No.</Label>
              <Input
                value={meta.invoiceNumber}
                onChange={(e) => onMetaChange({ ...meta, invoiceNumber: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Issue Date</Label>
              <Input
                type="date"
                value={meta.issueDate}
                onChange={(e) => onMetaChange({ ...meta, issueDate: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Due Date</Label>
              <Input
                type="date"
                value={meta.dueDate}
                onChange={(e) => onMetaChange({ ...meta, dueDate: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Language</Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={meta.language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onMetaChange({ ...meta, language: 'en' })}
                  className={`flex-1 ${meta.language === 'en' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                >
                  EN
                </Button>
                <Button
                  type="button"
                  variant={meta.language === 'bm' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onMetaChange({ ...meta, language: 'bm' })}
                  className={`flex-1 ${meta.language === 'bm' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                >
                  BM
                </Button>
                <Button
                  type="button"
                  variant={meta.language === 'both' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onMetaChange({ ...meta, language: 'both' })}
                  className={`flex-1 ${meta.language === 'both' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                >
                  EN + BM
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Client Details */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Client
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Company Name</Label>
              <Input
                value={client.company}
                onChange={(e) => onClientChange({ ...client, company: e.target.value })}
                placeholder="Company name"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contact Person</Label>
              <Input
                value={client.name}
                onChange={(e) => onClientChange({ ...client, name: e.target.value })}
                placeholder="Contact person name"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <Input
                value={client.address}
                onChange={(e) => onClientChange({ ...client, address: e.target.value })}
                placeholder="Street address"
                className="bg-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">City</Label>
                <Input
                  value={client.city}
                  onChange={(e) => onClientChange({ ...client, city: e.target.value })}
                  placeholder="City"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Postcode</Label>
                <Input
                  value={client.postcode}
                  onChange={(e) => onClientChange({ ...client, postcode: e.target.value })}
                  placeholder="Postcode"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">State</Label>
                <Select
                  value={client.state}
                  onValueChange={(value) => onClientChange({ ...client, state: value })}
                >
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {MALAYSIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <Label htmlFor="overseas-toggle" className="text-sm text-gray-700 cursor-pointer">
                Overseas client (zero-rated SST)
              </Label>
              <Switch
                id="overseas-toggle"
                checked={client.isOverseas}
                onCheckedChange={(checked) => onClientChange({ ...client, isOverseas: checked })}
              />
            </div>
            {client.isOverseas && (
              <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3">
                <Info className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                <p className="text-sm text-sky-700">
                  Service Tax will be zero-rated (0%) as this is an exported service.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 3 - Line Items */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Line Items
          </h3>
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_50px_90px_36px_80px_28px] gap-2 px-3 py-3 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500">Description</span>
              <span className="text-xs font-medium text-gray-500 text-center">Qty</span>
              <span className="text-xs font-medium text-gray-500">Unit Price</span>
              <span className="text-xs font-medium text-gray-500 text-center">SST</span>
              <span className="text-xs font-medium text-gray-500 text-right">Amount</span>
              <span></span>
            </div>
            {/* Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_50px_90px_36px_80px_28px] gap-2 px-3 py-3 items-center border-b border-gray-100 last:border-b-0"
              >
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  placeholder="Service description"
                  className="h-9"
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="h-9 text-center"
                  min={1}
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    RM
                  </span>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="h-9 pl-10"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="flex justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Checkbox
                          checked={item.isTaxable}
                          onCheckedChange={(checked) => updateLineItem(item.id, 'isTaxable', Boolean(checked))}
                          disabled={!hasSstRegistration}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Apply 8% Service Tax to this item
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-sm font-mono text-right text-gray-700">
                  RM {formatCurrency(item.quantity * item.unitPrice)}
                </span>
                <button
                  onClick={() => removeLineItem(item.id)}
                  aria-label={`Remove ${item.description || 'line item'}`}
                  className="flex justify-center cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-150" />
                </button>
              </div>
            ))}
            {/* Add Item Button */}
            <div className="px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addLineItem}
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Line Item
              </Button>
            </div>
          </div>
        </section>

        {/* Section 4 - Totals */}
        <section className="mb-8">
          <div className="rounded-lg bg-gray-100 p-4">
            <div className="flex justify-end mb-2">
              <span className="text-sm text-gray-600 w-32">Subtotal</span>
              <span className="text-sm text-gray-700 w-32 text-right font-mono">
                RM {formatCurrency(subtotal)}
              </span>
            </div>
            {hasSstRegistration && (
              <div className="flex justify-end mb-2">
                <div className="flex items-center gap-2 w-32">
                  <span className="text-sm text-sky-600">
                    {client.isOverseas ? 'Service Tax (0%)' : 'Service Tax (8%)'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    SST
                  </span>
                </div>
                <span className={`text-sm w-32 text-right font-mono ${client.isOverseas ? 'text-gray-500 italic' : 'text-sky-600'}`}>
                  RM {formatCurrency(sstAmount)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-end">
              <span className="text-base font-bold text-gray-700 w-32">TOTAL</span>
              <span className="text-base font-bold text-orange-600 w-32 text-right font-mono">
                RM {formatCurrency(total)}
              </span>
            </div>
          </div>
        </section>

        {/* Section 5 - Settings & Notes */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-bank-details" className="text-sm text-gray-700 cursor-pointer">Show bank/payment details</Label>
              <Switch
                id="show-bank-details"
                checked={meta.showBankDetails}
                onCheckedChange={(checked) => onMetaChange({ ...meta, showBankDetails: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-duitnow-qr" className="text-sm text-gray-700 cursor-pointer">Include DuitNow QR code</Label>
              <Switch
                id="show-duitnow-qr"
                checked={meta.showDuitNowQR}
                onCheckedChange={(checked) => onMetaChange({ ...meta, showDuitNowQR: checked })}
              />
            </div>
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-6 mb-4">
            Notes
          </h3>
          <Textarea
            value={meta.notes}
            onChange={(e) => onMetaChange({ ...meta, notes: e.target.value })}
            placeholder="Payment terms, additional notes..."
            className="bg-white min-h-[80px]"
          />
        </section>

        {/* Section 6 - Action Buttons */}
        <section className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onPreview}
            className="w-full h-11 lg:hidden"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview PDF
          </Button>
          <Button
            type="button"
            size="lg"
            className={`w-full h-11 font-semibold text-white transition-colors duration-200 ${
              downloadState === 'done'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={handleDownload}
          >
            {downloadState === 'done' ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Invoice Ready
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice PDF
              </>
            )}
          </Button>
        </section>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pt-2 pb-4">
          Built by{' '}
          <a href="https://www.praxor.dev/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium">
            Praxor
          </a>
        </p>
      </div>
    </div>
  )
}

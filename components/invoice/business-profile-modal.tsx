'use client'

import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  type BusinessProfile,
  MALAYSIAN_STATES,
  MALAYSIAN_BANKS,
  ACCENT_COLORS,
} from '@/lib/invoice-types'

interface BusinessProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: BusinessProfile
  onProfileChange: (profile: BusinessProfile) => void
}

export function BusinessProfileModal({
  open,
  onOpenChange,
  profile,
  onProfileChange,
}: BusinessProfileModalProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return // 2MB limit
    const reader = new FileReader()
    reader.onload = () => {
      onProfileChange({ ...profile, logo: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Business Profile</DialogTitle>
          <DialogDescription>
            Configure your business details for invoice generation
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-700">Business Name</Label>
                <Input
                  value={profile.businessName}
                  onChange={(e) => onProfileChange({ ...profile, businessName: e.target.value })}
                  placeholder="Your business name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">SSM Registration No.</Label>
                <Input
                  value={profile.registrationNo}
                  onChange={(e) => onProfileChange({ ...profile, registrationNo: e.target.value })}
                  placeholder="e.g., 202301012345"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">SST Registration No.</Label>
                <Input
                  value={profile.sstRegistrationNo}
                  onChange={(e) => onProfileChange({ ...profile, sstRegistrationNo: e.target.value })}
                  placeholder="Leave empty if not registered"
                />
                <p className="text-xs text-gray-500">Leave empty if not SST registered</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <Input
                value={profile.address}
                onChange={(e) => onProfileChange({ ...profile, address: e.target.value })}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">City</Label>
                <Input
                  value={profile.city}
                  onChange={(e) => onProfileChange({ ...profile, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Postcode</Label>
                <Input
                  value={profile.postcode}
                  onChange={(e) => onProfileChange({ ...profile, postcode: e.target.value })}
                  placeholder="Postcode"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">State</Label>
                <Select
                  value={profile.state}
                  onValueChange={(value) => onProfileChange({ ...profile, state: value })}
                >
                  <SelectTrigger className="w-full">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
                  placeholder="hello@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => onProfileChange({ ...profile, phone: e.target.value })}
                  placeholder="+60 12-345 6789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Logo</Label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="sr-only"
                aria-label="Upload business logo"
              />
              {profile.logo ? (
                <div className="relative w-full h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={profile.logo} alt="Business logo" className="max-h-28 max-w-full object-contain" />
                  <button
                    onClick={() => onProfileChange({ ...profile, logo: null })}
                    aria-label="Remove logo"
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-900/60 text-white hover:bg-gray-900/80 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none transition-colors duration-150 cursor-pointer"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload logo</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                  </div>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Accent Color</Label>
              <div className="flex items-center gap-3">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onProfileChange({ ...profile, accentColor: color.value })}
                    aria-label={`${color.name}${profile.accentColor === color.value ? ' (selected)' : ''}`}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 focus-visible:outline-none ${
                      profile.accentColor === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={profile.accentColor}
                    onChange={(e) => onProfileChange({ ...profile, accentColor: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <Input
                    value={profile.accentColor}
                    onChange={(e) => onProfileChange({ ...profile, accentColor: e.target.value })}
                    className="w-24 h-8 text-xs font-mono"
                    placeholder="#f97316"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Bank Details Tab */}
          <TabsContent value="bank" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
              <Select
                value={profile.bankName}
                onValueChange={(value) => onProfileChange({ ...profile, bankName: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {MALAYSIAN_BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Account Name</Label>
              <Input
                value={profile.accountName}
                onChange={(e) => onProfileChange({ ...profile, accountName: e.target.value })}
                placeholder="Account holder name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Account Number</Label>
              <Input
                value={profile.accountNumber}
                onChange={(e) => onProfileChange({ ...profile, accountNumber: e.target.value })}
                placeholder="1234 5678 9012"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">DuitNow Registered Number (Optional)</Label>
              <Input
                value={profile.duitNowNumber}
                onChange={(e) => onProfileChange({ ...profile, duitNowNumber: e.target.value })}
                placeholder="+60123456789"
              />
              <p className="text-xs text-gray-500">For DuitNow QR code generation</p>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Invoice Number Prefix</Label>
                <Input
                  value={profile.invoicePrefix}
                  onChange={(e) => onProfileChange({ ...profile, invoicePrefix: e.target.value })}
                  placeholder="INV"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Invoice Counter</Label>
                <Input
                  type="number"
                  value={profile.invoiceCounter}
                  onChange={(e) => onProfileChange({ ...profile, invoiceCounter: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Default Payment Terms</Label>
              <Select
                value={String(profile.defaultPaymentTerms)}
                onValueChange={(value) => onProfileChange({ ...profile, defaultPaymentTerms: parseInt(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Default Notes</Label>
              <Textarea
                value={profile.defaultNotes}
                onChange={(e) => onProfileChange({ ...profile, defaultNotes: e.target.value })}
                placeholder="Payment terms, thank you message, etc."
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Settings, PanelLeftClose, PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Kbd } from '@/components/ui/kbd'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onNewInvoice: () => void
  onOpenProfile: () => void
}

export function Sidebar({ onNewInvoice, onOpenProfile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === '.') {
        e.preventDefault()
        setCollapsed((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo + Collapse Toggle */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500">
              <FileText className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-xl font-bold text-white">BilKu</span>
                <p className="text-xs text-gray-400">SST invoices in 60s</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="flex items-center gap-2">
                  Collapse <Kbd>&#8984;.</Kbd>
                </span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Expand button when collapsed (replaces logo area interaction) */}
      {collapsed && (
        <div className="p-3 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span className="flex items-center gap-2">
                Expand <Kbd>&#8984;.</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* New Invoice Button */}
      <div className="p-3">
        {collapsed ? (
          <Button
            onClick={onNewInvoice}
            className="w-10 h-10 p-0 bg-orange-500 hover:bg-orange-600 text-white"
            title="New Invoice"
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onNewInvoice}
            className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Business Profile */}
      <div className="mt-auto border-t border-gray-800 p-3">
        <button
          onClick={onOpenProfile}
          className={cn(
            'flex items-center rounded-lg hover:bg-gray-800 text-sm text-gray-300 transition-colors duration-150 cursor-pointer',
            collapsed ? 'w-10 h-10 justify-center' : 'w-full gap-2 px-3 py-2.5'
          )}
          title={collapsed ? 'Business Profile' : undefined}
        >
          <Settings className="h-4 w-4 text-gray-500 shrink-0" />
          {!collapsed && 'Business Profile'}
        </button>
      </div>
    </aside>
  )
}

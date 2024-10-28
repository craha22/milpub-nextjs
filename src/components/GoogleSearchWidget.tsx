'use client'

import { useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gen-search-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        configId: string
        triggerId: string
      }
    }
  }
}

interface GoogleSearchWidgetProps {
  configId: string
  className?: string
  placeholder?: string
}

export default function GoogleSearchWidget({ 
  configId, 
  className = '', 
  placeholder = 'Search here' 
}: GoogleSearchWidgetProps) {
  const triggerId = 'searchWidgetTrigger'
  const widgetRef = useRef<HTMLElement | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Load the Google Search Widget script
    const script = document.createElement('script')
    script.src = 'https://cloud.google.com/ai/gen-app-builder/client?hl=en_US'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className={className}>
      <gen-search-widget
        ref={widgetRef}
        configId={configId}
        triggerId={triggerId}
      />
      <input
        id={triggerId}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-indigo-500 focus:outline-none focus:ring"
      />
    </div>
  )
}
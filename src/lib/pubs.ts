// Contains the logic to lookup pub data from supabase given a pub id

import { supabase } from './supabaseClient'

export async function getPub(id: string) {
  const { data, error } = await supabase
    .from('pub_metadata')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getPubUrl(id: string): Promise<string> {
  const { data, error } = await supabase
    .from('pub_metadata')
    .select('source_url,pdf_link')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  if (data.pdf_link && data.pdf_link.length > 0 && data.source_url && data.source_url.length > 0) {
    // take the last element off the sourceurl and append the pdf link
    const sourceUrl = data.source_url.split('/')
    sourceUrl.pop()
    return sourceUrl.join('/') + '/' + data.pdf_link
  } else {
    throw new Error('No pdf link found')    
  }
}
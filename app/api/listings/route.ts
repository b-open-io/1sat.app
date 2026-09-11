import { listingCreateDisabledBody } from '@/lib/ordlock'

export function POST() {
  return Response.json(listingCreateDisabledBody(), { status: 410 })
}

export function PUT() {
  return Response.json(listingCreateDisabledBody(), { status: 410 })
}

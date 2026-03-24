import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const iconData = await readFile(join(process.cwd(), 'public/icon-512.png'))
  const base64 = iconData.toString('base64')

  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* biome-ignore lint: using img for OG image generation */}
      <img
        src={`data:image/png;base64,${base64}`}
        width={180}
        height={180}
        style={{ borderRadius: 40 }}
      />
    </div>,
    { ...size },
  )
}

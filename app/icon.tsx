import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const iconData = await readFile(join(process.cwd(), 'public/icon-128.png'))
  const base64 = iconData.toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* biome-ignore lint: using img for OG image generation */}
        <img
          src={`data:image/png;base64,${base64}`}
          width={32}
          height={32}
          style={{ borderRadius: 6 }}
        />
      </div>
    ),
    { ...size },
  )
}

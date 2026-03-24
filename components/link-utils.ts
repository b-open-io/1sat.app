/** Returns anchor props for links that open in a new tab. */
export function externalLinkProps(label?: string) {
  return {
    target: '_blank' as const,
    rel: 'noopener noreferrer',
    ...(label ? { 'aria-label': `${label} (opens in new tab)` } : {}),
  }
}

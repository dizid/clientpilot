// Types for the subset-font package (it ships none). Used by scripts/fa-subset.ts.
declare module 'subset-font' {
  interface SubsetFontOptions {
    targetFormat?: 'sfnt' | 'woff' | 'woff2' | 'truetype'
    preserveNameIds?: number[]
    variationAxes?: Record<string, number | { min: number; max: number; default?: number }>
  }
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: SubsetFontOptions,
  ): Promise<Buffer>
}

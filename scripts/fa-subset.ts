/**
 * Font Awesome subset (Vite plugin).
 *
 * ClientPilot uses ~55 Font Awesome icons, but the full Free set has ~2,000: ~300 KB of
 * icon fonts and ~100 KB of CSS that every visitor of the landing page downloaded.
 * At the start of every Vite run (dev server, build, SSR build, e2e), this plugin:
 *   1. scans src/ and index.html for the fa-* classes the code uses,
 *   2. writes a copy of Font Awesome's all.css with only those icon rules
 *      (every non-icon rule - .fa-solid, .fa-spin, @font-face ... - is kept as is),
 *   3. writes the webfonts with only those icons' glyphs,
 * into src/assets/fa-subset/ (gitignored). main.ts imports that CSS instead of
 * all.min.css. Same Font Awesome version and glyphs, so icons look exactly the same.
 *
 * Adding an icon: just use its class in the code; the next dev/build run picks it up
 * (restart a running dev server). Icon classes must appear as whole literal strings
 * ('fa-solid fa-gear'), never glued together ('fa-' + name): the build stops on those,
 * because the scan couldn't see which icon is meant.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import subsetFont from 'subset-font'
import type { Plugin, ResolvedConfig } from 'vite'

const require = createRequire(import.meta.url)
const FA_ROOT = path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'))
const FA_CSS = path.join(FA_ROOT, 'css', 'all.css')
const FA_FONTS = path.join(FA_ROOT, 'webfonts')

/** Files that may contain icon classes. */
const SCAN_EXTENSIONS = new Set(['.vue', '.ts', '.js', '.html'])
/** Any fa-* token, e.g. fa-gear, fa-solid, fa-spin. */
const FA_CLASS = /\bfa-[a-z0-9-]+/g
/** A class name built from pieces ('fa-' + x, `fa-${x}`): the scan can't see the icon. */
const GLUED_CLASS = /['"`]fa-['"`]|fa-\$\{/
/** One icon rule in all.css, e.g. `.fa-gear::before {\n  content: "\f013"; }` */
const ICON_RULE = /^\.(fa-[a-z0-9-]+)::?before \{\s*content: "\\([0-9a-f]+)"; \}\n*/gm
/** A webfont source: the woff2 file followed by its ttf fallback. */
const FONT_SRC =
  /url\("\.\.\/webfonts\/([a-z0-9-]+)\.woff2"\) format\("woff2"\), url\("\.\.\/webfonts\/\1\.ttf"\) format\("truetype"\)/g

async function listFiles(dir: string, skipDir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full !== skipDir) files.push(...(await listFiles(full, skipDir)))
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

/** All fa-* classes used in the given files. Throws on a glued-together class name. */
async function findUsedClasses(files: string[], root: string): Promise<Set<string>> {
  const used = new Set<string>()
  for (const file of files) {
    const text = await fs.readFile(file, 'utf8')
    if (GLUED_CLASS.test(text)) {
      throw new Error(
        `fa-subset: ${path.relative(root, file)} builds an icon class from pieces ('fa-' + ...). ` +
          'Write the full class (e.g. \'fa-solid fa-gear\') so the icon subset can include it.',
      )
    }
    for (const match of text.matchAll(FA_CLASS)) used.add(match[0])
  }
  used.delete('fa-subset') // this plugin's own name (main.ts imports assets/fa-subset/), not a class
  return used
}

/** Write a file only when its content changed (keeps the dev server from reloading). */
async function writeIfChanged(file: string, content: string | Buffer): Promise<void> {
  const next = typeof content === 'string' ? Buffer.from(content) : content
  const current = await fs.readFile(file).catch(() => null)
  if (current && current.equals(next)) return
  await fs.writeFile(file, next)
}

export interface FaSubsetResult {
  /** Icon classes kept (a used class that names a Font Awesome icon). */
  icons: string[]
  /** Used fa-* classes that are neither an icon nor another Font Awesome class. */
  unknown: string[]
}

/** Build src/assets/fa-subset/ (CSS + fonts) for the icons used under `root`. */
export async function buildFaSubset(root: string): Promise<FaSubsetResult> {
  const srcDir = path.join(root, 'src')
  const outDir = path.join(srcDir, 'assets', 'fa-subset')
  const files = [...(await listFiles(srcDir, outDir)), path.join(root, 'index.html')]
  const used = await findUsedClasses(files, root)

  const fullCss = await fs.readFile(FA_CSS, 'utf8')
  const codepoints = new Set<number>()
  const icons = new Set<string>()
  let iconRuleCount = 0
  const css = fullCss.replace(ICON_RULE, (rule, name: string, hex: string) => {
    iconRuleCount++
    if (!used.has(name)) return ''
    icons.add(name)
    codepoints.add(parseInt(hex, 16))
    return rule
  })
  // Guard against a Font Awesome update that changes the CSS layout: if the icon rules
  // aren't recognised any more, stop instead of shipping icons that show nothing.
  if (iconRuleCount < 1000) {
    throw new Error(`fa-subset: found only ${iconRuleCount} icon rules in ${FA_CSS}; its format changed`)
  }

  // Point every @font-face at the trimmed woff2 next to the CSS (woff2 works in every
  // browser this app supports, so the much bigger .ttf fallbacks are dropped).
  const fontFiles = new Set<string>()
  const subsetCss = css.replace(FONT_SRC, (_src, font: string) => {
    fontFiles.add(font)
    return `url("./${font}.woff2") format("woff2")`
  })
  if (fontFiles.size === 0 || subsetCss.includes('../webfonts/')) {
    throw new Error('fa-subset: could not rewrite the @font-face sources in all.css; its format changed')
  }

  await fs.mkdir(outDir, { recursive: true })
  const glyphs = String.fromCodePoint(...codepoints)
  for (const font of fontFiles) {
    const original = await fs.readFile(path.join(FA_FONTS, `${font}.woff2`))
    const trimmed = await subsetFont(original, glyphs, { targetFormat: 'woff2' })
    await writeIfChanged(path.join(outDir, `${font}.woff2`), trimmed)
  }
  await writeIfChanged(path.join(outDir, 'fa-subset.css'), subsetCss)

  // Classes that match nothing in Font Awesome Free (e.g. a Pro-only icon) render nothing
  // with or without this subset; report them so they can be fixed.
  const unknown = [...used].filter((cls) => !icons.has(cls) && !fullCss.includes(`.${cls}`)).sort()
  return { icons: [...icons].sort(), unknown }
}

/** Vite plugin: (re)build the subset before Vite resolves any module. */
export function faSubset(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'fa-subset',
    configResolved(resolved) {
      config = resolved
    },
    async buildStart() {
      const { icons, unknown } = await buildFaSubset(config.root)
      config.logger.info(`fa-subset: ${icons.length} Font Awesome icons kept`)
      if (unknown.length) {
        config.logger.warn(`fa-subset: not in Font Awesome Free, these show nothing: ${unknown.join(', ')}`)
      }
    },
  }
}

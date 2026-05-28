import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const configPath = join(process.cwd(), 'next.config.mjs')
const configContent = readFileSync(configPath, 'utf-8')

describe('next.config.mjs image settings', () => {
  it('should not have unoptimized: true', () => {
    expect(configContent).not.toMatch(/unoptimized\s*:\s*true/)
  })

  it('should have remotePatterns configured', () => {
    expect(configContent).toMatch(/remotePatterns/)
  })

  it('should allow patchwiki.biligame.com as remote pattern', () => {
    expect(configContent).toMatch(/patchwiki\.biligame\.com/)
  })
})

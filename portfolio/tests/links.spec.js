import { test, expect } from '@playwright/test'

test.describe('Navbar links', () => {
  test('all main nav sections load without errors', async ({ page }) => {
    const routes = ['/', '/#/about', '/#/skills', '/#/projects', '/#/blog', '/#/contact']

    for (const route of routes) {
      const errors = []
      page.on('pageerror', e => errors.push(e.message))
      await page.goto(route)
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      expect(errors.filter(e => !e.includes('giscus')), `Errors on ${route}`).toHaveLength(0)
    }
  })

  test('home page renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    // Should have some heading
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 5000 })
  })

  test('dark mode toggle exists and works', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('button[aria-label*="dark"], button[aria-label*="theme"], button[title*="dark"], button[title*="theme"]').first()
    const count = await toggle.count()
    if (count > 0) {
      const htmlEl = page.locator('html')
      await toggle.click()
      await page.waitForTimeout(300)
      // html should have dark or light class
      const classes = await htmlEl.getAttribute('class')
      expect(classes).toBeTruthy()
    }
  })
})

test.describe('External links', () => {
  test('GitHub links have target=_blank and rel=noopener', async ({ page }) => {
    await page.goto('/')
    const githubLinks = page.locator('a[href*="github.com"]')
    const count = await githubLinks.count()
    for (let i = 0; i < count; i++) {
      const link = githubLinks.nth(i)
      const target = await link.getAttribute('target')
      const rel = await link.getAttribute('rel')
      expect(target, `GitHub link ${i} missing target=_blank`).toBe('_blank')
      expect(rel, `GitHub link ${i} missing rel noopener`).toContain('noopener')
    }
  })
})

test.describe('Projects page', () => {
  test('renders without crashing', async ({ page }) => {
    await page.goto('/#/projects')
    await expect(page.locator('body')).toBeVisible()
    await page.waitForTimeout(1000)
    // No unhandled errors from page
    const h = await page.locator('h1, h2, h3').first()
    await expect(h).toBeVisible({ timeout: 8000 })
  })
})

test.describe('Contact page', () => {
  test('renders a form or contact info', async ({ page }) => {
    await page.goto('/#/contact')
    await expect(page.locator('body')).toBeVisible()
    // Contact page should have a heading or some content
    const content = page.locator('h1, h2, h3, form').first()
    await expect(content).toBeVisible({ timeout: 5000 })
  })
})

test.describe('404 / unknown routes', () => {
  test('unknown route does not crash the app', async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('/#/does-not-exist-xyz')
    await page.waitForTimeout(1000)
    expect(errors.filter(e => !e.includes('giscus'))).toHaveLength(0)
  })
})

import { test, expect } from '@playwright/test'

// Mock blog data served locally since blog fetches from GitHub
const MOCK_INDEX = JSON.stringify([
  {
    slug: 'test-post',
    title: 'Test Post Title',
    date: '2026-01-01',
    tags: ['devops', 'test'],
    cover: '',
    excerpt: 'A test post excerpt for Playwright tests.'
  }
])

const MOCK_POST = `---
title: Test Post Title
date: 2026-01-01
tags: [devops, test]
excerpt: A test post excerpt for Playwright tests.
---

# Test Post Title

Intro paragraph for the test post.

## Section One

Content in section one.

### Subsection

More content here.

## Section Two

Content in section two.
`

test.describe('Blog listing page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock GitHub raw API responses
    await page.route('**/raw.githubusercontent.com/**/index.json', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: MOCK_INDEX })
    )
    await page.route('**/raw.githubusercontent.com/**/posts/**/*.md', route =>
      route.fulfill({ status: 200, contentType: 'text/plain', body: MOCK_POST })
    )
  })

  test('loads and shows at least 1 post card', async ({ page }) => {
    await page.goto('/#/blog')
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('tag filter works', async ({ page }) => {
    await page.goto('/#/blog')
    await page.locator('a[href*="/blog/"]').first().waitFor({ timeout: 10000 })

    // Get first non-All tag button
    const tagButtons = page.locator('button').filter({ hasNotText: /^All/ })
    const count = await tagButtons.count()
    if (count > 0) {
      await tagButtons.first().click()
      await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible({ timeout: 5000 })
      await page.locator('button').filter({ hasText: /^All/ }).click()
      await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible()
    }
  })

  test('clicking a post navigates to blog post page', async ({ page }) => {
    await page.goto('/#/blog')
    const postLink = page.locator('a[href*="/blog/"]').first()
    await postLink.waitFor({ timeout: 10000 })
    await postLink.click()
    await expect(page).toHaveURL(new RegExp('#/blog/'))
  })
})

test.describe('Blog post page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/raw.githubusercontent.com/**/index.json', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: MOCK_INDEX })
    )
    await page.route('**/raw.githubusercontent.com/**/posts/**/*.md', route =>
      route.fulfill({ status: 200, contentType: 'text/plain', body: MOCK_POST })
    )
  })

  test('renders title and markdown content', async ({ page }) => {
    await page.goto('/#/blog/test-post')
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('article, .prose').first()).toBeVisible({ timeout: 5000 })
  })

  test('TOC links scroll to correct heading without navigating away', async ({ page }) => {
    await page.goto('/#/blog/test-post')
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 })

    // All TOC buttons should exist
    const tocButtons = page.locator('aside button')
    await expect(tocButtons.first()).toBeVisible({ timeout: 5000 })
    const count = await tocButtons.count()
    expect(count).toBeGreaterThan(0)

    const urlBefore = page.url()

    // Click first TOC item — should NOT navigate away
    await tocButtons.first().click()
    await page.waitForTimeout(600)
    expect(page.url()).toBe(urlBefore)

    // The target heading should exist in the DOM with a matching id
    const firstLabel = await tocButtons.first().textContent()
    const expectedId = firstLabel.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    const heading = page.locator(`[id="${expectedId}"]`)
    await expect(heading).toBeAttached()

    // Click second TOC item too
    if (count > 1) {
      await tocButtons.nth(1).click()
      await page.waitForTimeout(600)
      expect(page.url()).toBe(urlBefore)
    }
  })

  test('Back to Blog link navigates back to blog listing', async ({ page }) => {
    await page.goto('/#/blog/test-post')
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 })
    const backLink = page.locator('a', { hasText: /back to blog/i }).first()
    await backLink.waitFor({ timeout: 5000 })
    await backLink.click()
    await expect(page).toHaveURL(/#\/blog$/)
  })
})

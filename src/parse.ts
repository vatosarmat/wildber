import puppeteer, { ElementHandle, Browser, Page, CDPSession } from 'puppeteer'

// const sleep = async (seconds: number) => new Promise(r => setTimeout(r, seconds))

const brand = {
  site: 'https://www.wildberries.ru/',
  selector: {
    input: '#searchInput',
    query: '#catalog .product-card__main .brand-name',
  },
}

export async function parseBrands(query: string): Promise<string[]> {
  console.log(query)
  const browser = await puppeteer.launch({
    args: ['--window-size=1920,1080'],
    defaultViewport: null,
  })
  const page = await browser.newPage()
  const client = await page.target().createCDPSession()
  await client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto(brand.site)
  await page.waitForNetworkIdle()
  await page.type(brand.selector.input, query, { delay: 100 })
  await page.keyboard.press('Enter')
  await page.waitForNetworkIdle()
  await page.screenshot({ path: 'screenshot.png' })

  const result = (await page.$$eval(brand.selector.query, elements =>
    elements.map(el => el.textContent).filter(txt => txt)
  )) as string[]

  await client.detach()
  await browser.close()

  return result
}

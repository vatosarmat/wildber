import puppeteer, { ElementHandle, Browser, Page, CDPSession } from 'puppeteer'

// const sleep = async (seconds: number) => new Promise(r => setTimeout(r, seconds))

const brand = {
  site: 'https://www.wildberries.ru/',
  selector: {
    clearBtn: '#searchBlock .search-catalog__btn--clear',
    input: '#searchInput',
    applyInput: '#applySearchBtn',
    results: (q: string) => `//h1[contains(text(),"${q}")]`,
    query: '#catalog .product-card__main .brand-name',
  },
}

export class SiteParser {
  private browser: Browser
  private cdp: CDPSession
  private page: Page

  public async launch() {
    this.browser = await puppeteer.launch({
      args: ['--window-size=1920,1080'],
      defaultViewport: null,
    })
    this.page = await this.browser.newPage()
    this.cdp = await this.page.target().createCDPSession()
    await this.cdp.send('Emulation.clearDeviceMetricsOverride')
    await this.page.goto(brand.site)
    await this.page.waitForNetworkIdle()
  }

  public async stop() {
    await this.cdp.detach()
    await this.browser.close()
  }

  public async queryBrands(query: string) {
    console.log(query)
    // await this.page.goto(brand.site)
    // await this.page.waitForSelector(brand.selector.applyInput)
    // await this.page.waitForNetworkIdle()
    // this.page.click(brand.selector.input, { clickCount: 3 })
    // await this.page.keyboard.press('Backspace')

    await this.page.click(brand.selector.clearBtn).catch(er => er)
    await this.page.type(brand.selector.input, query, { delay: 100 })
    // await this.page.keyboard.press('Enter')
    await this.page.click(brand.selector.applyInput)
    await this.page.waitForXPath(brand.selector.results(query))
    // await this.page.waitForSelector(brand.selector.results)
    await this.page.screenshot({ path: 'screenshot.png' })

    const result = (await this.page.$$eval(brand.selector.query, elements =>
      elements.map(el => el.textContent).filter(txt => txt)
    )) as string[]

    return result
  }
}

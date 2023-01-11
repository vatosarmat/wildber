import puppeteer, { ElementHandle, Browser, Page, CDPSession } from 'puppeteer'

// const sleep = async (seconds: number) => new Promise(r => setTimeout(r, seconds))
//

const UI_TIMEOUT = 100

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

  private async scrollDown() {
    return await this.page.evaluate(
      (timeout: number) =>
        new Promise(resolve => {
          const delta = 100
          let prevScrollY = 0
          const timer = setInterval(() => {
            window.scrollBy(0, delta)

            // const stop =
            //   window.scrollY + window.innerHeight + delta > document.body.scrollHeight

            //Scroll while it's actually scrolling
            const stop = window.scrollY === prevScrollY
            if (stop) {
              clearInterval(timer)
              resolve(null)
            }
            prevScrollY = window.scrollY
          }, timeout)
        }),
      UI_TIMEOUT
    )
  }

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

  public async parseBrandsFromCatalogContent(query: string) {
    console.log(query)
    // await this.page.goto(brand.site)
    // await this.page.waitForSelector(brand.selector.applyInput)
    // await this.page.waitForNetworkIdle()
    // this.page.click(brand.selector.input, { clickCount: 3 })
    // await this.page.keyboard.press('Backspace')

    await this.page.click(brand.selector.clearBtn).catch(er => er)
    await this.page.type(brand.selector.input, query, { delay: UI_TIMEOUT })
    // await this.page.keyboard.press('Enter')
    await this.page.click(brand.selector.applyInput)
    await this.page.waitForXPath(brand.selector.results(query))
    // await this.page.waitForSelector(brand.selector.results)
    // await this.page.screenshot({ path: 'screenshot.png' })
    await this.scrollDown()

    const result = (await this.page.$$eval(brand.selector.query, elements =>
      elements.map(el => el.textContent).filter(txt => txt)
    )) as string[]

    return result
  }

  // public async parseBrandsFromBrandsSelector() {}
}

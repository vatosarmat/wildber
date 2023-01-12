const DEBOUNCE_TIMEOUT = 1000
let timer: number | undefined = undefined

class BrandListManager {
  private brandElements: Record<string, HTMLElement> = {}
  private highlightedElements: Record<string, HTMLElement> = {}
  // private brandList: string[] = []
  // private highlightString?: string = undefined

  constructor(brandListEl: HTMLElement) {
    for (const item of brandListEl.children) {
      if (item.textContent) {
        // this.brandList.push(item.textContent)
        this.brandElements[item.textContent] = item as HTMLElement
      }
    }
  }

  public highlight(hlStr: string) {
    for (const [brandStr, brandEl] of Object.entries(this.brandElements)) {
      const startOffset = brandStr.toLowerCase().indexOf(hlStr)

      if (startOffset > -1) {
        //apply highlight
        const endOffset = brandStr.length - (startOffset + hlStr.length)

        const span = document.createElement('span')
        span.textContent = brandStr.slice(
          ...(endOffset > 0 ? [startOffset, -endOffset] : [startOffset])
        )
        span.classList.add('text-matched')
        const newChildren: (HTMLElement | Text)[] = []

        if (startOffset > 0) {
          newChildren.push(document.createTextNode(brandStr.slice(0, startOffset)))
        }
        newChildren.push(span)
        if (endOffset > 0) {
          newChildren.push(document.createTextNode(brandStr.slice(-endOffset)))
        }

        brandEl.replaceChildren(...newChildren)
        this.highlightedElements[brandStr] = brandEl
      } else if (this.highlightedElements[brandStr]) {
        brandEl.replaceChildren(document.createTextNode(brandStr))
        delete this.highlightedElements[brandStr]
      }
    }
  }

  public clearHighlight() {
    for (const [str, el] of Object.entries(this.highlightedElements)) {
      el.replaceChildren(document.createTextNode(str))
      delete this.highlightedElements[str]
    }
  }
}

addEventListener('load', () => {
  const brandListEl = document.getElementById('brandList')
  if (!brandListEl) {
    //no query results
    return
  }

  const brandListManager = new BrandListManager(brandListEl)
  const brandInput = document.getElementById('myBrand')!

  brandInput.addEventListener('input', evt => {
    const element = evt.target as HTMLInputElement
    const inputText = element.value.trim().toLowerCase()

    clearTimeout(timer)
    timer = setTimeout(() => {
      if (inputText.length >= 3) {
        brandListManager.highlight(inputText)
      } else {
        brandListManager.clearHighlight()
      }
    }, DEBOUNCE_TIMEOUT) as unknown as number
  })
})

import fs from 'fs/promises'
import express, { Request, Response } from 'express'
import { engine as handlebarsEngine } from 'express-handlebars'

import { SiteParser } from './parse'
import { appPath } from './utils'

const app = express()
const siteParser = new SiteParser()
// const parseForm = express.urlencoded({ extended: true })

app.use('/public', express.static(appPath('public')))
app.set('views', appPath('views'))
app.set('view engine', 'hbs')
app.engine(
  'hbs',
  handlebarsEngine({
    extname: '.hbs',
    helpers: {
      not: function (v: unknown) {
        return !v
      },
      isDisabled: function (v: unknown) {
        return v ? 'disabled' : ''
      },
    },
  })
)

//

const home = async (req: Request, res: Response) => {
  const query = req.query.searchQuery as unknown as string | undefined

  let locals
  if (query) {
    locals = {
      searchQueryValue: query,
      items: Object.keys(await siteParser.parseBrandsFromCatalogContent(query)),
    }
  } else {
    locals = {
      searchQueryValue: '',
    }
  }

  res.render('home', locals)
}

app.get('/', home)

siteParser.launch().then(() =>
  app.listen(3000, () => {
    console.log('server running')
  })
)

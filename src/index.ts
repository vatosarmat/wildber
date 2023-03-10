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
      empty: function (v: unknown) {
        return !v || (Array.isArray(v) && v.length === 0)
      },
      emptyArray: function (v: unknown) {
        return Array.isArray(v) && v.length === 0
      },
      // not: function (v: unknown) {
      //   return !v
      // },
      // or: function (a: unknown, b: unknown) {
      //   return a || b
      // },
      maybeDisabled: function (v: unknown) {
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

void siteParser.launch().then(() =>
  app.listen(process.env.PORT || 3000, () => {
    console.log('server running')
  })
)

import fs from 'fs/promises'
import express, { Request, Response } from 'express'
import { engine as handlebarsEngine } from 'express-handlebars'

import { parseBrands } from './parse'
import { appPath } from './utils'

const app = express()
const parseForm = express.urlencoded({ extended: true })

app.use('/public', express.static(appPath('public')))
app.set('views', appPath('views'))
app.set('view engine', 'hbs')
app.engine(
  'hbs',
  handlebarsEngine({
    extname: '.hbs',
  })
)

//

const home = async (req: Request, res: Response) => {
  const locals = {
    items: req?.body?.searchQuery ? await parseBrands(req.body.searchQuery) : undefined,
  }

  res.render('home', locals)
}

app.get('/', home)
app.post('/', parseForm, home)

app.listen(3000, () => {
  console.log('server running')
})

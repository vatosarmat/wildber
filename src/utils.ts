import path from 'path'

export const appPath = (p = '.'): string => path.join(__dirname, '..', p)

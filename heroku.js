import Koa from 'koa'
import convert from 'koa-convert'
import serve from 'koa-static'

const app = new Koa()
const PORT = 3444

app.use(convert(serve(__dirname + '/dist')))
app.listen(PORT)

console.log(`listening on ${PORT}`)

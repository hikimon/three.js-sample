import Koa from 'koa'
import serve from 'koa-static'
const app = new Koa()

app.use(serve('./'))

const port = 3001

app.listen(port, () => console.log(`server started ${port}`))

export default app

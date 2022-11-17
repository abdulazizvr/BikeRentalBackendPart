const logger = require("koa-logger")
const Koa = require('koa');
const config = require('config');
const bodyParser = require("koa-bodyparser")
const router = require("./routes/index.routes")
const static = require("koa-static")
const cors = require('@koa/cors');
const port = config.get("port")
const sequelize = require("./config/db");
const errorHandler = require("./middlewares/ErrorHandlingMiddleware")

const app = new Koa()
app.use(logger())


app.use(static(__dirname+"\\public"))
app.use(bodyParser())
app.use(cors());
app.use(router)

app.use((ctx)=>{
    ctx.body = "Incorrect router ! Look you url"
})

app.on('error',(err,ctx) => {
    // ctx.error(500,{
    //     friendlyMsg:err.message
    // })
    ctx.status = 500
    ctx.body = err.message
})
app.use(errorHandler)
async function start(){
    try {
        await sequelize.authenticate();
        await sequelize.sync()
        console.log('Connection has been established successfully.');
        app.listen(port,()=>{
        console.log(`Server is running on ${port}`)
    })    
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        console.log(error)  
    }
}

start()



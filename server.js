const express = require('express')
const cors = require('cors')

// mongoose 是mongodb 的驱动
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/express-test',{ useNewUrlParser: true } )

const Product = mongoose.model('Product',new mongoose.Schema({
    title: String,
}))

const app = express()

app.use(cors())

app.use('/static',express.static('public'))

app.get('/',function(req,res){
    res.send('ok')
})
app.get('/about',function(req,res){
    res.send({
        page:'about us'
    })
})
app.get('/products', async function(req,res){
    res.send(await Product.find())
})

app.listen(4000,()=>{
    console.log('http://localhost:4000')
})
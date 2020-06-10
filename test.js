// const express = require('express')

const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); //post数据处理
const Router = require('koa-router');
// const cors = require('cors');
const cors = require('koa2-cors'); //跨域处理

var mysql = require('mysql');
// const app = express()

const app = new Koa();
const router = new Router();


app.use(bodyParser())

// app.use(cors)

app.use(
    cors({
        origin: function(ctx) { //设置允许来自指定域名请求
            if (ctx.url === '/test') {
                return '*'; // 允许来自所有域名请求
            }
            return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);



var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'pizza'
});

connection.connect(err => {
    if(err) throw err;
    console.log('mysql connncted success!');
})

router.get('/login', ctx => {
    return new Promise(resolve => {
        var  sql = 'SELECT * FROM user';

        connection.query(sql, (err,results) => {
            console.log('sql=',sql)
            if (err) throw err;
            ctx.body = results
            resolve();
        });
    })
})
router.get('/menu', ctx => {
    return new Promise(resolve => {
        var  sql = 'SELECT * FROM menu';

        connection.query(sql, (err,results) => {
            console.log('sql=',sql)
            // console.log('results=',results)

            if (err) throw err;
            ctx.body = results
            resolve();
        });
    })
})
router.post('/menu', ctx => {
    // console.log('ctx.request==',ctx.request.body)

    return new Promise(resolve => {
        const name = ctx.request.body.name;
        const description = ctx.request.body.description;
        const options = ctx.request.body.options;
        var size_one,size_two,price_one,price_two;

        size_one = options[0].size;
        price_one = options[0].price;
        size_two = options[1].size;
        price_two = options[1].price;
        

        var sql = `INSERT INTO menu(name, description,size_one,price_one,size_two,price_two)
    VALUES ('${name}','${description}','${size_one}','${price_one}','${size_two}','${price_two}') `;

        connection.query(sql, (err,results) => {
            console.log('sql=',sql)
            // console.log('results=',results)

            if (err) throw err;
            ctx.body = results
            resolve();
        });
    })
})

router.del('/deleteMenu', ctx => {
    // console.log('ctx.deleteMenu==',ctx.query.id)
    return new Promise(resolve => {
        const id = ctx.query.id;
        const sql = `DELETE FROM menu WHERE id = '${id}'`;
        connection.query(sql, (err, result) => {
        if (err) throw err;
        ctx.body = {
            code: 200,
            msg: `delete ${result.affectedRows} data from menu success!`
        };
        resolve();
        })
    })
})


router.post('/register',async (ctx) => {
    // console.log('ctx.request==',ctx.request.body)
    return new Promise(resolve => {
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;

        var sql = `INSERT INTO user(email, password)
    VALUES ('${email}','${password}') `;

        connection.query(sql, (err,results) => {
            
            if (err) throw err;
            ctx.body = results

            resolve();
        });
    })

})





app.use(router.routes());




 
// connection.end();

app.listen(4000,()=>{
    console.log('监听4000端口http://localhost:4000')
})
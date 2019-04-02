const express = require('express')
const app = express()
const http = require('http').Server(app)
//导入socket.io模块
const io = require('socket.io')(http)
// 记录用户数目
let userCount = 0
app.use(express.static('./pages'))
app.use(express.static('./node_modules'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/main.html')
})

io.on('connection', socket => {
    let nickname = ''
    socket.on('nickname', msg => {
        nickname = msg
        socket.emit('member enter', {
            success: true,
            nickname
        })
        socket.on('chat', msg2 => {
            console.log(msg2)
        io.emit('public', {
            success: true,
            message: msg2.value,
            color: msg2.color,
            id: msg2.id,
            nickname
        })
    })
    })
})

http.listen(3000, () => {
    console.log('server running at http://127.0.0.1:3000')
})
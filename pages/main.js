$(function () {
    var socket = io()
    //光标自动聚焦
    var enterInput = document.getElementsByClassName('enterInput')[0]
    enterInput.focus()
    //随机颜色
    var colorArr = ['red', 'yellow', 'black', 'green', 'skyblue', 'lawngreen']
    var count = 0
    //提交用户昵称
    $('.layer').on('keydown', function (e) {
        if (e.keyCode === 13) {
            if ($('.enterInput').val()) {
                var index = Math.floor(Math.random() * colorArr.length)
                var randomStr = (Math.random() + '')
                socket.emit('nickname', $('.enterInput').val())
                socket.on('member enter', function (data) {
                    if (data.success) {
                        //弹出层消失，聊天层出现
                        $('.layer').remove()
                        $('.wrap').css('display', 'block')
                        //欢迎用户
                        var htmlStr = '<li class="userEnter">欢迎' + data.nickname + '进入Feihong Chat</li>'
                        $('.messages').append(htmlStr)
                        //绑定点击事件
                        $('.send').on('click', function (e) {
                            sendMessage()
                        })
                        //使用enter键发送消息
                        $('.wrap').on('keyup', function (e) {
                            if (e.keyCode === 13) {
                                sendMessage()
                            }
                        })
                        function sendMessage() {
                            var msg = {
                                color: colorArr[index],
                                value: $('.enter').val(),
                                id: randomStr.substr(2, randomStr.length)
                            }
                            if (msg.value) {
                                socket.emit('chat', msg)
                            } else {
                                alert('Message cannot be a null value')
                            }
                        }
                        //渲染消息
                        socket.on('public', function (data) {
                            console.log(data.color)
                            var htmlStr = `<li class="userMsg">
                                <div class="nickname"  data="${data.id}"> ${data.nickname}</div>
                                <div class="info">${data.message}</div> 
                                </li>`
                            $('.messages').append(htmlStr);
                            $('div[data=' + data.id + ']').css('color', data.color);
                            $('.enter').val('')
                            // count++;
                        })
                    }
                })
            } else {
                alert('Nick name cannot be a null value')
            }
        }
    })
})
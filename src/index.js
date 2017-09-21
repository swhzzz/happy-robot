let colorLog = require('./color'),
    readline = require('readline'),
    http = require('http');

const API_KEY = '2f4829db98a6411fb09a97c0c0c9af77';

const CODE_MAP = {
    TEXT: 100000,
    URL: 200000,
    NEWS: 302000
}


let initChat = function() {
    function welcome() {
        const welcomeMsg = '好戏登场喽~';
        const delayTime = 150
        for (let i = 0; i < welcomeMsg.length; i++) {
            (function() {
                return setTimeout(() => {
                    colorLog('----------', welcomeMsg[i], '----------')
                }, i * delayTime)
            })()
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1)
            }, welcomeMsg.length * delayTime)
        })
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    let name = '';
    welcome().then((value) => {
        if (value === 1) { // 提示语print之后再请求问题
            rl.question('>主人你叫什么名字呀~~', (answer) => {
                name = answer
                colorLog('>主人你有什么问题吗(〃＾＾〃)')
                chat()
            })
        }
    })

    function chat() {
        rl.question('请输入问题(*･x･`*): ', (query) => {
            if (!query) {
                colorLog("欢迎下次光临(//'ω'//)")
                process.exit(0)
            }
            let req = http.request({
                hostname: 'www.tuling123.com',
                path: '/openapi/api',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk
                })
                res.on('end', () => {
                    colorLog(handleResponse(data))
                    chat()
                })
            })
            req.write(JSON.stringify({
                key: API_KEY,
                info: query,
                userid: name
            }))
            req.end()
        })
    }


    function handleResponse(data) {
        let dataObj = JSON.parse(data)
        let logData = ''
        switch (dataObj.code) {
            case CODE_MAP.TEXT:
                logData = dataObj.text
                break;
            case CODE_MAP.URL:
                logData = `${dataObj.text}\n${dataObj.url}`
                break;
            case CODE_MAP.NEWS:
                let list = dataObj.list
                list.forEach((item) => {
                    logData += `文章标题: ${item.article}\n来源: ${item.source} ${item.detailurl}\n`
                })
                break;
            default:
                logData = dataObj.text
        }
        return logData
    }
}

module.exports = initChat
const colorMap = {
    "Red": "\x1b[31m",
    "Green": "\x1b[32m",
    "Yellow": "\x1b[33m",
    "Blue": "\x1b[34m",
    "Magenta": "\x1b[35m",
    "Cyan": "\x1b[36m",
    "White": "\x1b[37m"
};

let colorArr = []
for (let key in colorMap) {
    colorArr.push(colorMap[key])
}

function getRandomColor() {
    return colorArr[Math.floor(Math.random() * 7)]
}

module.exports = function(...args) {
    randomColor = getRandomColor()
    console.log(`${randomColor}`, ...args)
}
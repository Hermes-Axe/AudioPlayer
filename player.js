
function parseLrics (data) {
  let res = data.split('\n')
  let lines = []
  res.forEach(line => {
    lines.push({
      time: _getTime(line),
      text: line.split(']')[1]
    })
  });
  return lines
}

function _getTime (line) {
  let time = line.split(']')[0].substring(1).split(':')
  return +time[0]*60 + +time[1]
}

let lines = parseLrics(data)
let domUl = document.getElementsByTagName('ul')[0]
// 根据歌词生成列表
function generateLines(lines) {
  
  let domF = document.createDocumentFragment()
  for (let index = 0; index < lines.length; index++) {
    let domLi = document.createElement('li')
    domLi.innerHTML = lines[index].text
    domF.append(domLi)
  }
  domUl.append(domF)
}

generateLines(lines)

let audioDom = document.getElementsByTagName('audio')[0]
let oldIndex = 0
audioDom.addEventListener('timeupdate', (ev) => {
  let currentIndex = findCurrentLine(audioDom.currentTime)
  if(oldIndex !== currentIndex) {
    setLineStyle(currentIndex)
    calcTop(currentIndex)
    oldIndex = currentIndex
  }
})

function findCurrentLine(currentTime){
  for (let index = 0; index < lines.length-1; index++) {
    if(currentTime >= lines[index].time && currentTime < lines[index+1].time) {
      return index
    }
  }
  return lines.length - 1
}

function setLineStyle (index) {
  let activedDom = domUl.getElementsByClassName('actived')[0]
  activedDom && activedDom.classList.remove('actived')
  domUl.children[index].classList.add('actived')
}

let containerDom = document.getElementsByClassName('container')[0]
let liDom = document.getElementsByTagName('li')[0]

function calcTop(index){
  let res = index * liDom.clientHeight + liDom.clientHeight/2 - containerDom.clientHeight/2
  if (res < 0) res = 0
  domUl.style.transform = `translateY(-${res}px)`
}
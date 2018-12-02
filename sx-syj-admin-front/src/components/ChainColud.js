import React, { Component } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import * as THREE from 'three'
import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import shadow from '../assets/shadow.png'
import star from '../assets/star.png'
import { Table } from 'antd'
import { getNew } from '../utils/request' // 数据接口请求

const styles = {
  btnStyle: {
    position: 'absolute',
    right: '100px',
    top: '20px',
    backgroundColor: 'rgb(7, 55, 112)',
    color: 'rgb(3, 140, 194)',
    fontWeight: 'bold',
    width: '100px',
    height: '30px',
    textAlign: 'center',
    lineHeight: '30px',
    cursor: 'pointer',
    borderRadius: '5px'
  },
  blockStyle: {
    display: 'inline-block',
    marginRight: 40,
    fontSize: 18
  },
  formStyle: {
    position: 'absolute',
    top: '600px',
    left: '50%',
    width: '48%',
    transform: 'translate(2%, 0)',
    borderRadius: '2px',
    border: '1px solid #005891',
    background: 'rgba(0, 0, 0, .09)'
  },
  headerStyle: {
    color: '#02c3fe',
    fontSize: 22,
    backgroundColor: '#00213b',
    textAlign: 'center'
  },
  blockNumStyle: {
    color: 'rgb(0,255,255)',
    fontSize: '45px',
    fontFamily: 'ShangHei'
  }
}
// 定义数据
class ChainCloud extends Component {
  canvasBox = null
  img = []
  imgUrl = [img1, img2]
  shadow = null
  shadowUrl = shadow
  starImg = star
  times = 9
  scale = 1
  points = []
  starAnimationList = []
  starAnimationStep = 120
  dotColor = ['#fff99f', '#1d4088', '#1d4088', '#1d4088', '#1d4088',
    '#ece400', '#ffa26a', '#fc5f01', '#ff7a2b', '#ff7734',
    '#fc5401', '#ff904d', '#ff452c', '#ffffff', '#01fcdb',
    '#00ffff', '#7dbbf5', '#00a2ff', '#1eadff', '#7690ff']
  reduceIndex = []
  msgPlaneWidth = 300
  msgPlaneHeight = 160
  totalFrames = 18000
  loopFrames = 150
  data = {block: [], trade: []}
  organizations = []
  msg3d = [
    {
      real_name: '药监局数据中心',
      index: 0,
      org_id: '0',
      tradeTime: '2017-04-21 08:29:38',
      totalFrames: this.totalFrames,
      loopFrames: this.loopFrames,
      finalPosition: {
        x: 750,
        y: 170,
        z: 0
      }
    },
    {
      real_name: '市场监管总局',
      index: 1,
      org_id: '0',
      tradeTime: '2017-04-21 08:29:38',
      totalFrames: this.totalFrames,
      loopFrames: this.loopFrames,
      finalPosition: {
        x: 750,
        y: -30,
        z: 0
      }
    },
    {
      real_name: '药审中心',
      index: 2,
      org_id: '0',
      tradeTime: '2017-04-21 08:29:38',
      totalFrames: this.totalFrames,
      loopFrames: this.loopFrames,
      finalPosition: {
        x: 750,
        y: -230,
        z: 0
      }
    },
    {
      real_name: '核查中心',
      index: 3,
      org_id: '0',
      tradeTime: '2017-04-21 08:29:38',
      totalFrames: this.totalFrames,
      loopFrames: this.loopFrames,
      finalPosition: {
        x: -750,
        y: 170,
        z: 0
      }
    },
    {
      real_name: '浙江省食药监局',
      index: 4,
      org_id: '0',
      tradeTime: '2017-04-21 08:29:38',
      totalFrames: this.totalFrames,
      loopFrames: this.loopFrames,
      finalPosition: {
        x: -750,
        y: -30,
        z: 0
      }
    }
  ]
  state = {
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 4,
    yao: 0,
    zjs: 0,
    test: 0,
    wei: 0,
    all: 0,
    dataSource: [],
    dataSource2: []
  }
  columns = [
    {
      title: '批准文号',
      dataIndex: 'drug_no',
      key: 'drug_no',
      render: (value) => {
        return (<span style={{color: 'rgb(0,255,255)'}}>国药准字<br/>{value}</span>)
      }
    },
    {
      title: '数据类型',
      dataIndex: 'data_type',
      key: 'data_type',
      render: (text, row) => {
        return <span style={{color: 'rgb(0,255,255)'}}>{text}</span>
      }
    },
    {
      title: '业务类型',
      dataIndex: 'business_type',
      key: 'business_type',
      render: (text, row) => {
        return <span style={{color: 'rgb(0,255,255)'}}>{text}</span>
      }
    },
    {
      title: '调用时间',
      dataIndex: 'security_time',
      key: 'security_time',
      render: (text, row) => {
        return <span style={{color: 'rgb(0,255,255)'}}>{text}</span>
      }
    }
  ]
  columns2 = [
    {
      title: '批准文号',
      dataIndex: 'drug_no',
      key: 'drug_no',
      render: (value) => {
        return (<span style={{color: 'rgb(0,255,255)'}}>国药准字<br/>{value}</span>)
      }
    },
    {
      title: '数据类型',
      dataIndex: 'data_type',
      key: 'data_type',
      render: (text, row) => {
        return <span style={{color: 'rgb(0,255,255)'}}>{text}</span>
      }
    },
    {
      title: '上链节点',
      dataIndex: 'drug_source',
      key: 'drug_source',
      render: (text, row) => {
        return <span style={{color: 'rgb(0,255,255)'}}>{text}</span>
      }
    },
    {
      title: '上链时间',
      dataIndex: 'success_time',
      key: 'success_time',
      render: (text, row) => {
        return <span style={{color: 'rgb(0,255,255)', marginLeft: -10}}>{text}</span>
      }
    }
  ]
  setImage = (src = '') => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = src
    return img
  }
  loadImage = (list, cb) => {
    return new Promise((resolve) => {
      const imgs = list.map(item => {
        return this.setImage(item)
      })
      cb(imgs)
      const timer = setInterval(() => {
        if (imgs.every(item => item.complete)) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  }
  ellipsis = (str = '', num) => {
    if (str.length > num) {
      return str.substr(0, num) + '...'
    } else {
      return str
    }
  }
  addMsg = (msg) => {
    for (var i = 0; i < msg.length; i++) {
      var m = Object.assign({}, msg[i])

      m.index = this.setMsg3dIndex(m.organizationName)
      m.totalFrames = this.totalFrames
      m.loopFrames = this.loopFrames
      m.finalPosition = {
        x: 850,
        y: 330,
        z: 0
      }
      this.msg3d.push(m)
    }
  }
  setMsg3dIndex = (m) => {
    for (var i = 0; i < this.organizations.length; i++) {
      if (this.organizations[i].name === m) break
    }
    if (i === this.organizations.length) {
      this.organizations.push({name: m, index: this.organizations.length})
    }

    return i
  }
  createBgCanvas = (value, width, height) => {
    var canvas = $('<canvas></canvas>')[0]
    canvas.width = width
    canvas.height = height
    var c = canvas.getContext('2d')
    if (value === 1) {
      c.drawImage(this.img[0], 0, 0)
    } else if (value === 2) {
      c.drawImage(this.img[1], 0, 0)
    } else if (value === 3) {
      c.drawImage(this.shadow, 0, 0)
    } else {
      c.drawImage(value, 0, 0)
    }
    return canvas
  }
  createBgMesh = (value) => {
    var image = null
    if (value === 1) {
      image = this.img[0]
    } else if (value === 2) {
      image = this.img[1]
    } else if (value === 3) {
      image = this.shadow
    }
    var bgPlane = new THREE.PlaneGeometry(image.width, image.height)
    var canvas = this.createBgCanvas(value, image.width, image.height)
    var src = canvas.toDataURL('image/png')
    var texture = new THREE.TextureLoader().load(src)
    texture.minFilter = THREE.LinearFilter
    var bgMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    return {
      mesh: new THREE.Mesh(bgPlane, bgMaterial),
      texture: texture
    }
  }
  createDotMesh = (point, color, group) => {
    const dot = new THREE.SphereGeometry(8, 20, 20)
    const dotMaterial = new THREE.MeshBasicMaterial({
      color
    })
    const dotMesh = new THREE.Mesh(dot, dotMaterial)
    dotMesh.position.set(point.x, point.y, point.z)
    group.add(dotMesh)
  }
  msg3dAnimation = (m, index) => {
    m.msgGroup = new THREE.Group()
    !!(this.msgGroup) && this.msgGroup.add(m.msgGroup)
    // this.msgGroup.add(m.msgGroup)
    var msgPlane = new THREE.PlaneGeometry(this.msgPlaneWidth, this.msgPlaneHeight)
    var canvas = !!(this.points[m.index]) && this.createMsgCanvas(m, this.points[m.index].color)
    // var canvas = this.createMsgCanvas(m, this.points[m.index].color)
    var texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter

    var msgPlaneMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    m.msgPlaneMesh = new THREE.Mesh(msgPlane, msgPlaneMaterial)
    m.msgGroup.add(m.msgPlaneMesh)

    m.msgGroup.position.set(m.finalPosition.x, m.finalPosition.y, m.finalPosition.z)
  }
  createMsgCanvas = (m, color) => {
    var canvas = $('<canvas></canvas>')[0]
    canvas.width = this.msgPlaneWidth
    canvas.height = this.msgPlaneHeight
    var c = canvas.getContext('2d')
    c.fillStyle = 'rgba(10,33,61,1)'
    c.beginPath(8, 8)
    c.moveTo(8, this.msgPlaneHeight - 8)
    c.lineTo(this.msgPlaneWidth - 8, this.msgPlaneHeight - 8)
    c.lineTo(this.msgPlaneWidth - 8, 25)
    c.lineTo(this.msgPlaneWidth - 25, 8)
    c.lineTo(8, 8)
    c.fill()

    c.strokeStyle = color
    c.lineJoin = 'round'
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(1, 1)
    c.lineTo(1, this.msgPlaneHeight - 1)
    c.lineTo(this.msgPlaneWidth - 1, this.msgPlaneHeight - 1)
    c.lineTo(this.msgPlaneWidth - 1, 20)
    c.lineTo(this.msgPlaneWidth - 20, 1)
    c.lineTo(1, 1)
    c.stroke()

    c.font = '28px Arial,Microsoft YaHei'
    c.fillStyle = 'rgb(0,255,255)'
    c.fillText(this.ellipsis(m.real_name), 15, 50)

    c.font = '24px Arial,Microsoft YaHei'

    c.fillStyle = 'rgb(168,235,255)'
    c.fillText('运行情况: 正常', 15, 95)
    c.fillText('上链数量:' + this.ellipsis(m.org_id, 6), 15, 135)

    return canvas
  }
  reduceMsg3d = (index) => {
    for (var i = 0; i < index.length; i++) {
      this.msg3d.splice(index[i], 1)
    }
  }
  rendererResize = () => {
    var canvasBox = $('#canvas-box')

    this.camera.aspect = canvasBox.width() / canvasBox.height()
    this.camera.zoom = this.scale * this.times

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(canvasBox.width(), canvasBox.height())
  }
  addMsg3dMock = () => {
    var m = {
      organizationName: '浙金网',
      index: this.setMsg3dIndex('浙金网'),
      attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
      tradeTime: '2017-04-21 08:29:38',
      totalFrames: this.totalFrames,
      loopFrames: this.loopFrames,
      finalPosition: {
        x: 650,
        y: 330,
        z: 0
      }
    }
    this.buildTable('trade', this.data.trade, [m])
    this.msg3d.push(m)
  }
  getRelativePosition = (point) => {
    var rotate = this.group.rotation.y

    var r = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.z, 2))
    var angle = this.calcAngle(point.x, point.z, rotate)
    var _point = {
      x: r * Math.cos(angle),
      y: point.y,
      z: r * Math.sin(angle)
    }

    var r1 = Math.sqrt(Math.pow(_point.x, 2) + Math.pow(_point.y, 2))
    var angle1 = this.calcAngle(_point.x, _point.y, Math.PI * 23 / 180)

    return {
      x: r1 * Math.cos(angle1),
      y: r1 * Math.sin(angle1),
      z: _point.z
    }
  }
  calcAngle = (x, y, rotate) => {
    var angle = 0
    if (x === 0) {
      if (y > 0) {
        angle = Math.PI / 2
      } else {
        angle = -Math.PI / 2
      }
    } else if (x > 0) {
      angle = Math.atan(y / x)
    } else {
      if (y > 0) {
        angle = Math.atan(y / x) - Math.PI
      } else {
        angle = Math.atan(y / x) + Math.PI
      }
    }

    angle = (angle - rotate) % (Math.PI * 2)

    if (angle < -Math.PI) {
      angle += Math.PI * 2
    }

    return angle
  }
  addLight = (list) => {
    list.forEach(item => {
      let light = null
      if (item.type === 'Hemisphere') {
        light = new THREE.HemisphereLight(...item.light)
      } else {
        light = new THREE.DirectionalLight(...item.light)
      }
      light.position.set(...item.position)
      this.scene.add(light)
    })
  }
  element = null
  initRender = () => {
    this.canvasBox = $(this.element)
    const height = '600'
    const width = '1200'
    this.canvasBox.css({
      height,
      width,
      margin: '0 auto'
    })
    this.camera = new THREE.PerspectiveCamera(100, width / height, 1, 5500)
    this.camera.position.z = 4500
    this.camera.zoom = this.scale * this.times
    this.camera.updateProjectionMatrix()

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({alpha: true})
    this.renderer.setSize(this.canvasBox.width(), this.canvasBox.height())

    $(this.renderer.domElement).appendTo(this.canvasBox)

    this.addLight([
      {
        type: 'Hemisphere',
        light: [0x00395b, 0xb34670, 1],
        position: [0, 380, 0]
      },
      {
        light: [0xb34670],
        position: [0, -1, 100]
      },
      {
        light: [0x00395b],
        position: [0, 1, 100]
      },
      {
        light: [0x00395b],
        position: [0, 1, 0]
      }
    ])

    this.group = new THREE.Group()
    this.geometry = new THREE.IcosahedronGeometry(380, 3)
    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    })
    const mesh = new THREE.Mesh(this.geometry, material)
    this.group.add(mesh)
    this.scene.add(this.group)

    this.msgGroup = new THREE.Group()
    this.msgGroup.rotation.z = Math.PI * 23 / 180
    this.scene.add(this.msgGroup)

    this.bgGroup = new THREE.Group()
    this.bgGroup.rotation.z = Math.PI * 23 / 180
    let bg = this.createBgMesh(1)
    bg.mesh.position.set(-380 - bg.texture.image.width / 2 - 10, 0, 0)
    this.bgGroup.add(bg.mesh)
    bg = this.createBgMesh(2)
    bg.mesh.position.set(380 + bg.texture.image.width / 2 - 110, bg.texture.image.height / 2 + 180, -200)
    this.bgGroup.add(bg.mesh)
    bg = this.createBgMesh(2)
    bg.mesh.position.set(380 + bg.texture.image.width / 2 - 270, bg.texture.image.height / 2 - 280, 500)
    this.bgGroup.add(bg.mesh)
    bg = this.createBgMesh(3)
    bg.mesh.position.set(0, -380 - bg.texture.image.height / 2, 0)
    this.bgGroup.add(bg.mesh)
    this.scene.add(this.bgGroup)

    var vertices = this.geometry.vertices
    for (var i = 0; i < 20; i++) {
      var point = vertices[Math.floor(Math.random() * vertices.length)]
      if (i >= 0 && i < 6) {
        while (point.y > -120 || point.y < -300) {
          point = vertices[Math.floor(Math.random() * vertices.length)]
        }
      } else if (i >= 6 && i < 13) {
        while (point.y > 80 || point.y < -80) {
          point = vertices[Math.floor(Math.random() * vertices.length)]
        }
      } else if (i >= 13) {
        while (point.y > 300 || point.y < 120) {
          point = vertices[Math.floor(Math.random() * vertices.length)]
        }
      }
      let color = null
      if (i >= this.dotColor.length) {
        color = this.dotColor[i % this.dotColor.length]
      } else {
        color = this.dotColor[i]
      }
      this.points.push({ point: point, color })
      this.createDotMesh(point, color, this.group)
    }
    for (var m = 0; m < this.msg3d.length; m++) {
      this.msg3dAnimation(this.msg3d[m], m)
    }
  }
  animate = () => {
    this.starAnimationList.forEach((animate) => {
      const { mesh, start, stop } = animate
      if (animate.times > this.starAnimationStep) {
        if (!animate.finish) {
          animate.finish = true
          // this.createDotMesh(stop, color, this.group)
          // this.group.remove(mesh)
        }
        return
      }
      const xL = stop.x - start.x
      const yL = stop.y - start.y
      const zL = stop.z - start.z
      const { x, y, z } = mesh.position
      mesh.position.set(x + xL / this.starAnimationStep, y + yL / this.starAnimationStep, z + zL / this.starAnimationStep)
      animate.times++
    })

    this.camera.lookAt(this.scene.position)
    this.camera.rotation.z = Math.PI * 23 / 180
    this.group.rotation.y += Math.PI / 720
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate)
  }
  goLogin = () => {
    const { history } = this.props
    history.push('/login')
  }
  getNotExist = () => {
    const vertices = this.geometry.vertices
    const point = vertices[Math.floor(Math.random() * vertices.length)]
    let flag = false
    for (let i = 0; i < this.points.length; i++) {
      const po = this.points[i].point
      if (po.x === point.x && po.y === point.y && po.z === point.z) {
        flag = true
        break
      }
    }
    if (flag) {
      return this.getNotExist()
    } else {
      return point
    }
  }
  createChain = (startPoint) => {
    const point = this.getNotExist()
    const color = this.dotColor[parseInt(Math.random() * this.dotColor.length)]
    this.points.push({
      point,
      color
    })
    const dot = new THREE.SphereGeometry(8, 20, 20)
    const dotMaterial = new THREE.MeshBasicMaterial({
      color
    })
    const dotMesh = new THREE.Mesh(dot, dotMaterial)
    // this.starObject = new THREE.PlaneGeometry(32, 32)
    // const canvas = this.createBgCanvas(this.star, 32, 32)
    // const src = canvas.toDataURL('image/png')
    // const texture = new THREE.TextureLoader().load(src)
    // const material = new THREE.MeshBasicMaterial({
    //   map: texture,
    //   transparent: true
    // })
    // const mesh = new THREE.Mesh(this.starObject, material)
    const roEuler = new THREE.Euler(0, -this.group.rotation.y, 0, 'XYZ')
    const roPoint = new THREE.Vector3(...startPoint)
    roPoint.applyEuler(roEuler)
    dotMesh.position.set(roPoint.x, roPoint.y, roPoint.z)
    this.group.add(dotMesh)
    this.starAnimationList.push({
      color,
      times: 0,
      mesh: dotMesh,
      start: roPoint,
      stop: point
    })
  }
  compareData = (cache, now) => {
    const last = cache[0]
    const index = now.findIndex((item) => {
      return item.id === last.id
    })
    if (index !== 0) {
      return now.slice(0, index)
    }
    return []
  }
  run = () => {
    if (this.count === 100) {
      this.count = 0
      getNew({
        page: 1
      }).then((data) => {
        if (data && data.chain) {
          const compare = this.compareData(this.cacheData, data.chain.slice(0, 3))
          const compare2 = this.compareData(this.cacheData2, data.chain.slice(3, 6))
          const copare = this.compareData(this.cachData, data.newcall.slice(0, 4))
          const copare2 = this.compareData(this.cachData2, data.newcall.slice(3, 6))
          /* console.log(...compare)
          console.log(...compare2) */
          if ([...compare, ...compare2].length || [...copare, ...copare2].length) {
            [...compare, ...compare2].forEach(item => {
              switch (item.drug_source) {
                case '核查中心':
                  this.createChain([-550, -30, 0])
                  break
                case '药监局数据中心':
                  setTimeout(() => {
                    this.createChain([460, 360, 0])
                  }, 1000)
                  break
                case '总局信息中心':
                  setTimeout(() => {
                    this.createChain([460, 360, 0])
                  }, 1000)
                  break
                case '浙江省食药监局':
                  this.createChain([-500, -220, 0])
                  break
                case '市场监管总局':
                  this.createChain([500, 160, 0])
                  break
                case '药审中心':
                  this.createChain([550, -20, 0])
                  break
              }
            })
          }
          if ([...compare, ...compare2].length || [...copare, ...copare2].length) {
            console.log(...copare)
            console.log(...copare)
            this.cacheData = data.chain.slice(0, 3)
            this.cacheData2 = data.chain.slice(3, 6)
            this.cachData = data.newcall.slice(0, 3)
            this.cachData2 = data.newcall.slice(3, 6)
            console.log(this.state.dataSource)
            this.setState((prevState) => {
              prevState.dataSource2.unshift(...compare)
              prevState.dataSource2.unshift(...compare2)
              prevState.dataSource.unshift(...copare)
              prevState.dataSource.unshift(...copare2)
              return {
                // dataSource: ,
                dataSource: prevState.dataSource,
                dataSource2: prevState.dataSource2,
                num1: data.drug,
                num2: data.diao,
                num3: data.heightMax,
                yao: data.yao,
                zjs: data.zjs,
                test: data.test,
                wei: data.wei,
                all: data.all
              }
            })
            this.msg3d[0]['org_id'] = this.state.all
            this.msg3d[1]['org_id'] = this.state.wei
            this.msg3d[2]['org_id'] = this.state.yao
            this.msg3d[3]['org_id'] = this.state.test
            this.msg3d[4]['org_id'] = this.state.zjs
            for (var m = 0; m < this.msg3d.length; m++) {
              this.msg3dAnimation(this.msg3d[m], m)
            }
          }
        }
      })
    } else {
      this.count++
    }
    this.aid = requestAnimationFrame(this.run)
    /* clearInterval(this.aid)
    this.aid = setInterval(this.run, 1000) */
    this.forceUpdate()
  }
  componentDidMount () {
    this.loadImage([...this.imgUrl, this.shadowUrl, this.starImg], (arr) => {
      this.img[0] = arr[0]
      this.img[1] = arr[1]
      this.shadow = arr[2]
      this.star = arr[3]
    }).then(() => {
      this.initRender()
      this.animate()
      // 核查中心
      // this.createChain([-550, -30, 0])
      // 总局数据中心
      // this.createChain([460, 360, 0])
      // 浙江省食药监局
      // this.createChain([-500, -220, 0])
      // 卫生计生委
      // this.createChain([500, 160, 0])
      // 药审中心
      // this.createChain([550, -20, 0])
    })
    this.getData()
    this.count = 0
    this.run()
  }
  getData = (page = 1) => getNew({page}).then((data) => {
    if (data) {
      this.cacheData = data.chain.slice(0, 3)
      this.cacheData2 = data.chain.slice(3, 6)
      this.cachData = data.newcall.slice(0, 3)
      this.cachData2 = data.newcall.slice(3, 6)
      data.chain[0].type = '专网调用'
      data.chain[1].type = '外网调用'
      data.chain[2].type = '专网调用'
      this.setState({
        dataSource: data.newcall.slice(0, 3),
        dataSource2: data.chain.slice(0, 3),
        num1: data.drug,
        num2: data.diao,
        num3: data.heightMax,
        yao: data.yao,
        zjs: data.zjs,
        test: data.test,
        wei: data.wei,
        all: data.all
      })
      this.msg3d[0]['org_id'] = this.state.all
      this.msg3d[1]['org_id'] = this.state.wei
      this.msg3d[2]['org_id'] = this.state.yao
      this.msg3d[3]['org_id'] = this.state.test
      this.msg3d[4]['org_id'] = this.state.zjs
      for (var m = 0; m < this.msg3d.length; m++) {
        this.msg3dAnimation(this.msg3d[m], m)
      }
    }
  })
  componentWillUnmount () {
    cancelAnimationFrame(this.aid)
  }
  render () {
    // clearInterval(this.aids)
    // this.aids = setInterval(this.getData, 3000)
    // console.log(this.state.dataSource)
    return (
      <div id="chain-colud" style={{position: 'absolute', backgroundColor: '#000', width: '100%', height: '100%', minHeight: '900px', minWidth: '1200px'}}>
        <h1 style={{fontSize: 28, textAlign: 'center', color: '#90dae5', height: 30, lineHeight: 3}}>药品品种档案区块链上链云图</h1>
        <div onClick={this.goLogin} style={styles.btnStyle}>登 录</div>
        <div style={{
          position: 'absolute',
          fontFamily: 'Arial,Microsoft YaHei',
          color: '#fff',
          fontSize: '14px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={styles.blockStyle}>
            <div style={styles.blockNumStyle}>{this.state.num1}</div>
            <div>品种档案上链次数</div>
          </div>
          <div style={styles.blockStyle}>
            <div style={styles.blockNumStyle}>{this.state.num2}</div>
            <div>授权调用次数</div>
          </div>
          <div style={styles.blockStyle}>
            <div style={styles.blockNumStyle}>{this.state.num3}</div>
            <div>当前区块数量</div>
          </div>
          <div style={styles.blockStyle}>
            <div style={styles.blockNumStyle}>{this.state.num4}</div>
            <div>数据源节点数</div>
          </div>
        </div>
        <div ref= {ele => { this.element = ele }}></div>
        <div className="cloud" style={{
          ...styles.formStyle,
          transform: 'translate(-102%, 0)'
        }}>
          <div style={styles.headerStyle}>最新上链数据</div>
          <Table rowKey='id' className="cloud-table" showHeader pagination={false} columns={this.columns2} dataSource={this.state.dataSource2.length > 3 ? this.state.dataSource2.slice(0, 3) : this.state.dataSource2} />
        </div>
        <div className="cloud" style={styles.formStyle}>
          <div style={styles.headerStyle}>最新调用数据</div>
          <Table rowKey='id' className="cloud-table" showHeader pagination={false} columns={this.columns} dataSource={this.state.dataSource.length > 3 ? this.state.dataSource.slice(0, 3) : this.state.dataSource} />
        </div>
      </div>
    )
  }
}

export default connect()(ChainCloud)

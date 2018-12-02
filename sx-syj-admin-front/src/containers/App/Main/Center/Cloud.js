import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChainColud from '../../../../components/ChainColud'
import * as THREE from 'three'
import { getNew } from '../../../../utils/request'

class Cloud extends Component {
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
    console.log(index)
    if (index !== 0) {
      return now.slice(0, index)
    }
    return []
  }
  state = {
    topDataShow: {
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 4
    },
    blockDataShoow: {
      yao: 0,
      syj: 0,
      test: 0,
      wei: 0,
      all: 0
    },
    dataSource: [],
    dataSource2: []
  }
  getNew = (page = 1) => getNew({page}).then((data) => {
    if (data && data.chain) {
      const compare = this.compareData(this.cacheData, data.chain.slice(0, 3))
      const compare2 = this.compareData(this.cacheData2, data.chain.slice(3, 6))
      if ([...compare, ...compare2].length) {
        [...compare, ...compare2].forEach(item => {
          switch (item.drug_source) {
            case '核查中心':
              this.createChain([-550, -30, 0])
              break
            case '总局数据中心':
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
      if ([...compare, ...compare2].length) {
        this.cacheData = data.chain.slice(0, 3)
        this.cacheData2 = data.chain.slice(3, 6)
        this.setState((prevState) => {
          prevState.dataSource.unshift(...compare)
          prevState.dataSource2.unshift(...compare2)
          return {
            // dataSource: ,
            dataSource: prevState.dataSource,
            dataSource2: prevState.dataSource2,
            num1: data.drug,
            num2: data.diao,
            num3: data.heightMax,
            yao: data.yao,
            syj: data.syj,
            test: data.test,
            wei: data.wei,
            all: data.all
          }
        })
      }
    }
  })
  render () {
    return (
      <div>
        <ChainColud topDataShow={this.state.topDataShow} blockDataShoow={this.state.blockDataShoow} dataSource={this.state.dataSource} dataSource2={this.state.dataSource2}/>
      </div >
    )
  }
}

export default connect()(Cloud)

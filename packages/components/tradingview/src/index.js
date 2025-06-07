'use strict';

import { Cols, Stacks } from '@xatom/flex';
import $t from '@xatom/intl';
import { getTradingViewLang } from '@xatom/langs';
import actions from '@xatom/modular/src/actions';
import { Text } from '@xatom/typo';
import { toSeprator } from '@xatom/utils/src/index';
import { getMode } from '@xatom/utils/src/themes';
import { Checkbox, Icon, Popover, Spin } from 'antd';
import { merge } from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import './index.less';

function loadScript(options = {}) {
  if (options.src && window.scriptsLoaded && window.scriptsLoaded[options.src]) {
    options.onload && options.onload()
  } else {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.charset = "utf-8"
    script.src = options.src
    script.onerror = options.onerror || function (err) { console.error('load script error', err) }
    script.onload = function () {
      window.scriptsLoaded = Object.assign(window.scriptsLoaded || {}, {
        [options.src]: true
      })
      options.onload && options.onload()
    }
    document.body.appendChild(script)  // body 最后
  }
}

function getSymbol(props) {
  return props && props.kline && props.kline.item && props.kline.item.symbol
}

const DefaultTheme = {
  menus: {},
  tradingview: {
    toolbarBg: '#11141A',
    background: '#11141A',
    vertGrid: '#151826',
    horzGrid: '#151826',
    up: '#33ae72',
    down: '#BC434C',
    ma: ['#9A9A9A', '#FF9903', '#FF00FF', '#33ae72'],
    mp: '#9646e0',
    scales: '#282e38', // 刻度线（横纵坐标）
    textColor: '#848E9C', // 刻度标签颜色
    positions: {
      long: {
        quantityBg: 'rgba(255, 255, 255, 1)',
        bdColor: 'rgba(51, 174, 114, 1)',
        bgColor: 'rgba(51, 174, 114, 0.8)',
        lineColor: 'rgba(51, 174, 114, 0.8)'
      },
      short: {
        quantityBg: 'rgba(255, 255, 255, 1)',
        bdColor: 'rgba(235, 106, 97, 1)',
        bgColor: 'rgba(235, 106, 97, 0.8)',
        lineColor: 'rgba(235, 106, 97, 0.8)'
      }
    }
  }
}

const minOptions = [
  { label: "1" + $t('m'), value: '1' },
  { label: "3" + $t('m'), value: '3' },
  { label: "5" + $t('m'), value: '5' },
  { label: "15" + $t('m'), value: '15' },
  { label: "30" + $t('m'), value: '30' },
]
const lineTypeOptions = [
  { label: $t('Bars'), value: 0 },
  { label: $t('Candles'), value: 1 },
  { label: $t('Hollow Candles'), value: 9 },
  { label: $t('Line'), value: 2 },
  { label: $t('Area'), value: 3 },
  { label: $t('Baseline'), value: 10 },
  { label: $t('Heikin Ashi'), value: 8 }
]

let resPath = '/libs/trendingview/'

export default class TradingViewWidget extends React.Component {

  static defaultProps = {
    kline: {
    },
    url: '/market/tradepair/tradeview/kline',
    theme: DefaultTheme,
    maList: [5, 10, 20], // maList.length === theme.tradingview.ma.length
    mp: false,
    positions: null,
    namespace: 'spot',
    menus: [
      { type: 'action', text: $t('Index'), value: 'insertIndicator' },
      { type: 'lineType', options: minOptions, class: 'lineType' },
      { type: 'action', text: $t('Set'), value: 'chartProperties' },
      { type: 'fullScreen', text: $t('Full-screen') }
    ],
    storage: null,
    deps: [
      '/libs/trendingview/charting_library.standalone.js',
      '/libs/trendingview/datafeed.js'
    ],
    tvConfig: {}
  }

  queue = []

  get maList() {
    return this.props.maList
  }

  get storage() {
    return this.props.storage
  }

  get menus() {
    return this.props.menus
  }

  get StorageKeys() {
    return this.props.StorageKeys
  }

  get tvwidget() {
    return this.state.tvwidget
  }

  get chartIsReady() {
    return this.state.chartIsReady
  }

  get setResolution() {
    return this.props.setResolution
  }

  set tvwidget(tvwidget) {
    this.setState({
      tvwidget
    })
  }

  set chartIsReady(chartIsReady) {
    this.setState({
      chartIsReady
    })
  }

  constructor(props) {
    super(props)
    this.theme = merge(DefaultTheme, this.props.theme)
    this.state = {
      interval: this.storage.getInterval() || this.props.kline.item?.interval,
      tvwidget: null,
      chartIsReady: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevSymbol = getSymbol(this.props)
    const symbol = getSymbol(nextProps)
    this.setPricePrecision()
    this.symbol = symbol
    this.theme = merge(DefaultTheme, nextProps.theme)
    if (prevSymbol !== symbol) {
      if (this.tvwidget) {
        this.tvwidget.onChartReady(() => {
          // 重画K线
          this.setSymbol()
        })
      }
    }
  }
  componentDidUpdate(prevProps) {
    const prevPositions = prevProps.klineData && prevProps.klineData.positions || []
    const positions = this.props.klineData && this.props.klineData.positions || []

    const prevOrders = prevProps.klineData && prevProps.klineData.orders || []
    const orders = this.props.klineData && this.props.klineData.orders || []

    const prevTpslOrders = prevProps.klineData && prevProps.klineData.tpslOrders || []
    const tpslOrders = this.props.klineData && this.props.klineData.tpslOrders || []

    const prevTriggerOrders = prevProps.klineData && prevProps.klineData.triggerOrders || []
    const triggerOrders = this.props.klineData && this.props.klineData.triggerOrders || []

    const prevKlineHisOrder = prevProps.klineHisOrder || []
    const klineHisOrder = this.props.klineHisOrder || []
    if (this.tvwidget) {
      // 切换filter时重画仓位线、订单线
      this.tvwidget.onChartReady(() => {
        if ((!positions.length && prevPositions.length) || (!prevPositions.length && positions.length)) {
          // 重画仓位线
          this.clearPositions()
          this.drawPositions()
        }
        // 重画当前订单线
        if ((!orders.length && prevOrders.length) || (!prevOrders.length && orders.length)) {
          this.drawOpenOrders()
        }
        // 重画tpsl订单线
        if ((!tpslOrders.length && prevTpslOrders.length) || (!prevTpslOrders.length && tpslOrders.length)) {
          this.drawTpslOrders()
        }
        // 重画计划委托订单线
        if ((!triggerOrders.length && prevTriggerOrders.length) || (!prevTriggerOrders.length && triggerOrders.length)) {
          this.drawTriggerlOrders()
        }
        // 重画小箭头
        if ((!klineHisOrder.length && prevKlineHisOrder.length) || (!prevKlineHisOrder.length && klineHisOrder.length)) {
          this.clearHisOrders()
          this.drawHisOrders()
        }
      })
    }
  }

  loadScriptTask(src) {
    return new Promise((resolve) => {
      loadScript({
        src,
        onload: function () {
          window.scriptsLoaded[src] = true
          resolve(true)
        }
      })
    })
  }

  loadLibs() {
    return this.props.deps.reduce((task, dep) => {
      task = task.then(() => { return this.loadScriptTask(dep) })
      return task
    }, Promise.resolve(true))
  }

  // 绘制仓位线
  drawPositions() {
    try {
      const { positions = [] } = this.props.klineData
      const onPositionClose = this.props.onPositionClose
      const getQuantity = this.props.getQuantity
      const lastPrice = this.props.lastPrice
      let positionList = []
      positions.forEach(item => {
        let { pnl, quantity, avgPrice, side, separatedPositionId, symbol, leverage } = item
        const color = side === 'short' ? '#FC3C56' : '#00BF75'
        const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
        if (getQuantity && lastPrice) {
          quantity = getQuantity(quantity, symbol, lastPrice)
        }
        const sideText = side == 'short' ? $t('Short') : $t('Long')
        const text = `${sideText} ${toSeprator(pnl)}`
        positionList.push(this.tvwidget && this.tvwidget.chart()
          .createPositionLine()
          .setLineStyle(1)
          .setText(text)
          .setQuantity(toSeprator(quantity))
          .setLineLength(100)
          .setPrice(avgPrice)
          .setQuantityBackgroundColor(color).setBodyTextColor(color).setBodyBorderColor(color).setQuantityBorderColor(color).setLineColor(color).setBodyBackgroundColor('#FFFFFF')
          .setCloseButtonBorderColor(color).setCloseButtonBackgroundColor(btnBg).setCloseButtonIconColor(color)
          .onClose("onClose called", function (text) {
            const values = {
              separatedPositionId,
              orderType: 'market',
              quantity,
              leverage
            }
            //true: 表示k线上的当前仓位 进行闪电平仓
            onPositionClose && onPositionClose(values, item)
          })
        )
      })
      this.positionList = positionList
    } catch (error) {
      console.log('drawPositions error', error)
    }
  }

  // 清除仓位线
  clearPositions() {
    const positionList = this.positionList || []
    try {
      positionList.forEach(item => item.remove())
    } catch (error) {
      console.log('clearPositions error', error)
    }
    this.positionList = []
  }

  //绘制当前订单线
  createOpenOrderLine(text, quantity, orderPrice, direction, item, editable, onOpenOrderMove) {
    const onOpenOrderCancel = this.props.onOpenOrderCancel
    let color = (direction === 'openShort' || direction === 'closeLong') ? '#FC3C56' : '#00BF75'
    const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
    const order = this.tvwidget && this.tvwidget.chart().createOrderLine()
      .setLineStyle(1)
      .setLineLength(3)
      .setText(text)
      .setExtendLeft(false)
      .setQuantity(toSeprator(quantity))
      .setPrice(orderPrice)
      .setBodyBorderColor(color).setQuantityBorderColor(color).setLineColor(color).setQuantityBackgroundColor(color).setBodyTextColor(color).setBodyBackgroundColor('#FFFFFF')
      .setCancelButtonBorderColor(color).setCancelButtonBackgroundColor(btnBg).setCancelButtonIconColor(color)
      .onCancel(function (text) {
        onOpenOrderCancel && onOpenOrderCancel(item)
      })
    if (editable) {
      order.onMove(function (data) {
        onOpenOrderMove && onOpenOrderMove(item, order)
      })
    }
    return order
  }

  drawOpenOrders() {
    try {
      const { orders = [] } = this.props.klineData
      const onOpenOrderMove = this.props.onOpenOrderMove
      const getQuantity = this.props.getQuantity
      const orderList = this.orderList || []
      // 遍历新的订单数据
      orders.forEach(order => {
        let { orderId, direction, orderPrice, quantity, orderType, editable, symbol } = order
        let showType = orderType == 'postOnly' ? $t('Post Only') : orderType == 'planLimit' ? $t('Trigger Order') : $t('Limit')
        let text = `${showType}: ${toSeprator(orderPrice)}`
        const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
        if (getQuantity) {
          quantity = getQuantity(quantity, this.symbol, orderPrice)
        }
        const findOrder = orderList.find(item => item.id == orderId)
        // 此订单线已存在
        if (findOrder && findOrder.line) {
          if (editable) {
            findOrder.line.setQuantity(toSeprator(quantity)).setPrice(orderPrice).setText(text).setCancelButtonBackgroundColor(btnBg)
              .onMove(function (data) {
                onOpenOrderMove && onOpenOrderMove(order, findOrder.line)
              })
          } else {
            findOrder.line.setQuantity(toSeprator(quantity)).setPrice(orderPrice).setText(text)
          }
        } else {
          // 订单线不存在，创建新的订单线
          try {
            orderList.push({
              id: orderId,
              line: this.createOpenOrderLine(text, quantity, orderPrice, direction, order, editable, onOpenOrderMove)
            })
          } catch (e) { }
        }
      })
      // 遍历this中的订单线，删除已不存在的订单线
      orderList.forEach((item, i, array) => {
        const findLine = orders.find(order => item.id == order.orderId)
        if (!findLine) {
          item.line && item.line.remove()
          array.splice(i, 1)
        }
      })
      this.orderList = orderList
    } catch (error) {
      console.log('drawOpenOrders error', error)
    }
  }

  // 绘制tpsl订单线
  createTpslOrderLine(text, quantity, orderPrice, direction, orderType, item, onTpslOrderMove) {
    const onTpslOrderCancel = this.props.onTpslOrderCancel
    let color = (direction === 'openShort' || direction === 'closeLong') ? '#FC3C56' : '#00BF75'
    const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
    const order = this.tvwidget && this.tvwidget.chart().createOrderLine()
      .setLineStyle(1)
      .setLineLength(3)
      .setText(text)
      .setExtendLeft(false)
      .setQuantity(item.tpslType === 'position' ? $t('ALL') : toSeprator(quantity))
      .setPrice(orderPrice)
      .setBodyBorderColor(color).setQuantityBorderColor(color).setLineColor(color).setQuantityBackgroundColor(color).setBodyTextColor(color).setBodyBackgroundColor('#FFFFFF')
      .setCancelButtonBorderColor(color).setCancelButtonBackgroundColor(btnBg).setCancelButtonIconColor(color)
      .onCancel(function (text) {
        onTpslOrderCancel && onTpslOrderCancel(item)
      })
    order.onMove(function (data) {
      onTpslOrderMove && onTpslOrderMove(item, order, quantity)
    })
    return order
  }

  drawTpslOrders() {
    try {
      const { tpslOrders = [] } = this.props.klineData
      const onTpslOrderMove = this.props.onTpslOrderMove
      const getQuantity = this.props.getQuantity
      const tpslOrderList = this.tpslOrderList || []
      // 遍历新的订单数据
      tpslOrders.forEach(order => {
        let { id, direction, quantity, triggerDirection, triggerPrice, planType, tpslType, triggerWay, orderType, orderPrice, symbol } = order
        let text = `${planType == 'stopLoss' ? ($t('Stop Loss') + ':') : ($t('Take Profit') + ':')} ${orderType == 'planMarket' ? $t('Market Trigger') : $t('Limit {0} Trigger', { 0: orderPrice })} ${triggerDirection === 'lt' ? '≤' : '≥'} ${toSeprator(triggerPrice)}`
        const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
        if (getQuantity) {
          let calcPrice = orderType == 'planLimit' ? orderPrice : triggerPrice
          quantity = getQuantity(quantity, symbol, calcPrice)
        }
        const findOrder = tpslOrderList.find(item => item.id == id)
        // 此订单线已存在
        if (findOrder && findOrder.line) {
          findOrder.line.setQuantity(tpslType === 'position' ? $t('ALL') : toSeprator(quantity)).setPrice(triggerPrice).setText(text).setCancelButtonBackgroundColor(btnBg)
            .onMove(function (data) {
              onTpslOrderMove && onTpslOrderMove(order, findOrder.line, quantity)
            })
        } else {
          // 订单线不存在，创建新的订单线
          try {
            tpslOrderList.push({
              id: id,
              line: this.createTpslOrderLine(text, quantity, triggerPrice, direction, orderType, order, onTpslOrderMove)
            })
          } catch (e) { }
        }
      })
      // 遍历this中的订单线，删除已不存在的订单线
      tpslOrderList.forEach((item, i, array) => {
        const findLine = tpslOrders.find(order => item.id == order.id)
        if (!findLine) {
          item.line && item.line.remove()
          array.splice(i, 1)
        }
      })
      this.tpslOrderList = tpslOrderList
    } catch (error) {
      console.log('drawTpslOrders error', error)
    }
  }

  // 绘制计划委托订单线
  createTriggerOrderLine(text, quantity, triggerPrice, direction, item, onTriggerOrderMove) {
    const onTriggerOrderCancel = this.props.onTriggerOrderCancel
    let color = (direction === 'openShort' || direction === 'closeLong') ? '#FC3C56' : '#00BF75'
    const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
    const order = this.tvwidget && this.tvwidget.chart().createOrderLine()
      .setLineStyle(1)
      .setLineLength(3)
      .setText(text)
      .setExtendLeft(false)
      .setQuantity(toSeprator(quantity))
      .setPrice(triggerPrice)
      .setBodyBorderColor(color).setQuantityBorderColor(color).setLineColor(color).setQuantityBackgroundColor(color).setBodyTextColor(color).setBodyBackgroundColor('#FFFFFF')
      .setCancelButtonBorderColor(color).setCancelButtonBackgroundColor(btnBg).setCancelButtonIconColor(color)
      .onCancel(function (text) {
        onTriggerOrderCancel && onTriggerOrderCancel(item)
      })
    order.onMove(function (data) {
      onTriggerOrderMove && onTriggerOrderMove(item, order, quantity)
    })
    return order
  }

  drawTriggerlOrders() {
    try {
      const { triggerOrders = [] } = this.props.klineData
      const onTriggerOrderMove = this.props.onTriggerOrderMove
      const getQuantity = this.props.getQuantity
      const triggerOrderList = this.triggerOrderList || []
      // 遍历新的订单数据
      triggerOrders.forEach(order => {
        let { direction, quantity, triggerDirection, triggerPrice, triggerWay, orderType, orderPrice, id, symbol } = order
        let text = `${$t('Trigger')}: ${triggerWay == 'mark' ? $t('Mark Price') : $t('Last Price')} ${triggerDirection === 'lt' ? '≤' : '≥'} ${toSeprator(triggerPrice)}`
        const btnBg = this.theme?.type === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)'
        if (getQuantity) {
          let calcPrice = orderType == 'planLimit' ? orderPrice : triggerPrice
          quantity = getQuantity(quantity, symbol, calcPrice)
        }
        const findOrder = triggerOrderList.find(item => item.id == id)
        // 此订单线已存在
        if (findOrder && findOrder.line) {
          findOrder.line.setQuantity(toSeprator(quantity)).setPrice(triggerPrice).setText(text).setCancelButtonBackgroundColor(btnBg)
            .onMove(function (data) {
              onTriggerOrderMove && onTriggerOrderMove(order, findOrder.line, quantity)
            })
        } else {
          // 订单线不存在，创建新的订单线
          try {
            triggerOrderList.push({
              id: id,
              line: this.createTriggerOrderLine(text, quantity, triggerPrice, direction, order, onTriggerOrderMove)
            })
          } catch (e) { }
        }
      })
      // 遍历this中的订单线，删除已不存在的订单线
      triggerOrderList.forEach((item, i, array) => {
        const findLine = triggerOrders.find(order => item.id == order.id)
        if (!findLine) {
          item.line && item.line.remove()
          array.splice(i, 1)
        }
      })
      this.triggerOrderList = triggerOrderList
    } catch (error) {
      console.log('drawTriggerlOrders error', error)
    }
  }


  // 绘制历史订单小箭头
  drawHisOrders() {
    try {
      const klineHisOrder = this.props.klineHisOrder || []
      let hisOrderList = []
      klineHisOrder.forEach(item => {
        let { averagePrice, direction, orderTime } = item
        let color = ''
        color = direction === "sell" ? '#FC3C56' : '#00BF75'
        hisOrderList.push(this.tvwidget && this.tvwidget.chart().createExecutionShape()
          .setArrowColor(color)
          .setArrowSpacing(5)
          .setArrowHeight(8)
          .setDirection(direction)
          .setTime(orderTime / 1000)
          .setPrice(averagePrice)
        )
      })
      this.hisOrderList = hisOrderList
    } catch (error) {
      console.log('drawHisOrders error', error)
      if(!this.drawHisCatchTimes || this.drawHisCatchTimes < 5) {
        // 失败5次之内重新绘制
        this.drawHisCatchTimes = this.drawHisCatchTimes ? this.drawHisCatchTimes + 1 : 1
        this.hisTimer = setTimeout(() => {
          this.clearHisOrders()
          this.drawHisOrders()
        }, 1000)
      }
    }
  }
  // 清除历史订单小箭头
  clearHisOrders() {
    const hisOrderList = this.hisOrderList || []
    try {
      hisOrderList.forEach(item => item.remove())
    } catch (error) {
      console.log('clearHisOrders error', error)
    }
  }

  initCharts() {
    try {
      this.tvwidget && this.tvwidget.onChartReady(() => {
        this.chartIsReady = true
        const theme = this.theme
        if (this.props.mp) {
          this.tvwidget.chart().createStudy('MACD', false, false, [12, 26, 'close', 9], null, {
            "histogram.color": "#9A9A9A",
            "histogram.transparency": "0",
            "macd.color": "#9A9A9A",
            "macd.transparency": "60",
            "signal.color": "#FF00FF",
            "signal.transparency": "60"
          })
        }
        // 读取图表信息，加载新的图表
        let chartsObj = this.storage.getTVCandle()
        if (this.props.mp || !chartsObj || (chartsObj?.themeMode && chartsObj?.themeMode !== getMode())) {
          // 创建平均线
          const maLines = this.maList.map((ma, index) => {
            return {
              type: ma,
              plotColor: theme.tradingview.ma[index]
            }
          })
          maLines.forEach(config => {
            this.tvwidget.chart().createStudy('Moving Average', false, false, { 'length': config.type }, { 'plot.color': config.plotColor, 'showLabelsOnPriceScale': 0 })
          })
        }
        if (!this.props.mp) {
          // 监听指标、设置等改变，保存图表信息
          try {
            this.tvwidget.subscribe('onAutoSaveNeeded', () => {
              // Tab多开时，会互相竞争，导致保存到非当前币对，所以判断只有当前页面时保存
              if (!document.hidden) {
                this.tvwidget.save((chartsObj) => {
                  this.storage.setTVCandle({themeMode: getMode(), ...chartsObj})
                })
              }
            })
          } catch (error) {
            console.log('onAutoSaveNeeded error', error)
          }

          if (chartsObj && chartsObj.charts && (!chartsObj.themeMode || chartsObj.themeMode === getMode())) {
            chartsObj.charts[0].panes[0].sources.map((item, index) => {
              if (item.type === 'study_Compare') {
                chartsObj.charts[0].panes[0].sources.splice(index, 1)
              }
            })
            this.tvwidget.load(chartsObj)
            this.tvwidget.chart().setChartType(1)
          } else {
            // 创建交易量图表
            this.tvwidget.chart().createStudy('Volume', false, false, {})
            // 重置样式
            this.applyOverrides()
          }
        }
        // 重画 k线
        this.tvwidget.chart().onDataLoaded().subscribe(null, (res) => {
          this.setSymbol()
          this.tvwidget.chart().onDataLoaded().unsubscribeAll(null)
        })
        // 重画历史订单小箭头
        if (this.props.klineHisOrder) {
          this.clearHisOrders()
          this.drawHisOrders()
        }
      });
    } catch (error) {
      console.log('initCharts error', error)
    }
  }

  setInterval(interval) {
    this.tvwidget && this.tvwidget.onChartReady(() => {
      this.setState({
        interval
      })
      this.setResolution(this.storage.getResolution(interval), () => {
        try {
          this.tvwidget.chart().setResolution(interval, (res) => {
            if (!this.props.mp) {
              this.storage.setInterval(interval)
              this.tvwidget.save((chartsObj) => {
                this.storage.setTVCandle(chartsObj)
              })
            }
          })
        } catch (e) {
          // 切换周期时刚好ws异常，这时候刷新
          window.location.reload()
        }
      })
    })
  }

  changeTvTheme(theme) {
    this.theme = theme
    if(this.tvwidget) {
      this.tvwidget.changeTheme && this.tvwidget.changeTheme(theme.type)
      this.applyOverrides()
      this.drawLines()
    }
  }

  applyOverrides() {
    const userConfig = this.getUserTvConfig()
    setTimeout(() => {
      this.tvwidget && this.tvwidget.applyOverrides(userConfig.overrides || {})
    }, 0)
  }

  getUserTvConfig() {
    const symbol = this.storage.getCurrent()
    this.symbol = window.toWsSymbol ? window.toWsSymbol(symbol) : symbol //针对模拟盘特殊处理
    const colors = this.theme.tradingview
    const datafeed = new window.Datafeeds.StreamDatafeed(4000)
    const loadMoreBarsData = this.props.loadMoreBarsData
    if (loadMoreBarsData) {
      datafeed.loadMoreBars = function (params) {
        loadMoreBarsData(params)
      }
    }
    return {
      symbol: this.symbol,
      interval: this.state.interval,
      datafeed: datafeed,
      // toolbar_bg: colors.toolbarBg,
      overrides: {
        'paneProperties.background': colors.background,
        'paneProperties.backgroundGradientStartColor': colors.background,
        'paneProperties.backgroundGradientEndColor': colors.background,
        'mainSeriesProperties.candleStyle.upColor': colors.up,
        'mainSeriesProperties.candleStyle.downColor': colors.down,
        'mainSeriesProperties.candleStyle.borderUpColor': colors.up,
        'mainSeriesProperties.candleStyle.borderDownColor': colors.down,
        'mainSeriesProperties.candleStyle.wickUpColor': colors.up,
        'mainSeriesProperties.candleStyle.wickDownColor': colors.down,
        'symbolWatermarkProperties.color': colors.background,
        'paneProperties.vertGridProperties.color': colors.vertGrid,
        'paneProperties.horzGridProperties.color': colors.horzGrid,
        'mainSeriesProperties.hollowCandleStyle.upColor': colors.up,
        'mainSeriesProperties.hollowCandleStyle.downColor': colors.down,
        'mainSeriesProperties.hollowCandleStyle.borderUpColor': colors.up,
        'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.down,
        'mainSeriesProperties.hollowCandleStyle.wickUpColor': colors.up,
        'mainSeriesProperties.hollowCandleStyle.wickDownColor': colors.down,
        'scalesProperties.lineColor': colors.scales,
        'scalesProperties.textColor': colors.textColor,
        'bordercolor': colors.background
      },
      studies_overrides: {
        'volume.volume.color.0': colors.down,
        'volume.volume.color.1': colors.up,
        'volume.volume.transparency': 50,
        'volume.volume ma.color': colors.background,
      },
    }
  }

  getTvConfig() {
    let timezone = moment.tz.guess()
    const colors = this.theme.tradingview
    let defaultConfig = {
      theme: getMode(),
      width: '100%',
      height: '100%',
      symbol: 'BTC/USDT',
      interval: 60,
      container_id: "tv_chart_container",
      timezone: timezone || 'Asia/Hong_Kong',
      custom_css_url: this.props.isSpot ? '/libs/trendingview/tv-custom-spot.css' : '/libs/trendingview/tv-custom.css',
      datafeed: null,
      library_path: `${resPath}`,
      auto_save_delay: 1,
      locale: getTradingViewLang(),
      disabled_features: [
        'use_localstorage_for_settings', 'header_symbol_search', 'header_screenshot', 'symbol_search_hot_key',
        'header_saveload', 'header_undo_redo', 'header_compare', 'border_around_the_chart',/* 围绕背景 */
        'header_chart_type', 'header_interval_dialog_button', 'header_fullscreen_button', 'header_widget',
        'main_series_scale_menu', 'create_volume_indicator_by_default', 'legend_context_menu',
        'go_to_date', 'header_resolutions', 'header_indicators'
      ],
      enabled_features: ['control_bar'],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      // toolbar_bg: '#11141A',
      loading_screen: { backgroundColor: colors.background },
      overrides: {
        'paneProperties.background': colors.background,
        'paneProperties.backgroundGradientStartColor': colors.background,
        'paneProperties.backgroundGradientEndColor': colors.background,
        'paneProperties.legendProperties.showLegend': false,
        
        'mainSeriesProperties.candleStyle.upColor': colors.up,
        'mainSeriesProperties.candleStyle.downColor': colors.down,
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.borderUpColor': colors.up,
        'mainSeriesProperties.candleStyle.borderDownColor': colors.down,
        'mainSeriesProperties.candleStyle.wickUpColor': colors.up,
        'mainSeriesProperties.candleStyle.wickDownColor': colors.down,

        'mainSeriesProperties.hollowCandleStyle.upColor': colors.up,
        'mainSeriesProperties.hollowCandleStyle.downColor': colors.down,
        'mainSeriesProperties.hollowCandleStyle.drawWick': true,
        'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
        'mainSeriesProperties.hollowCandleStyle.borderUpColor': colors.up,
        'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.down,
        'mainSeriesProperties.hollowCandleStyle.wickUpColor': colors.up,
        'mainSeriesProperties.hollowCandleStyle.wickDownColor': colors.down,
        
        'scalesProperties.lineColor': colors.scales,
        'scalesProperties.textColor': colors.textColor,
        'scalesProperties.fontSize': 12,

        'bordercolor': colors.background
      },
      studies_overrides: {
        // Volume
        'volume.volume.color.0': colors.down,
        'volume.volume.color.1': colors.up,
        'volume.volume.transparency': 50,
        'volume.volume.plottype': 'columns',
        'volume.volume ma.color': colors.background,
        'volume.volume ma.transparency': 0,
        'volume.volume ma.linewidth': 1,
        'volume.volume ma.plottype': 'line',
        'volume.show ma': true
        // 'ma.Plot.color.1': '#FC3C56',
        // 'ma.Plot.color': 'green'
      },
      user_id: 'public_user_id'
    }
    const userConfig = this.getUserTvConfig()

    return merge(defaultConfig, this.props.tvConfig || {}, userConfig)
  }

  componentDidMount() {
    const init = () => {
      this.tvwidget = new window.TradingView.widget(this.getTvConfig())
      this.exportInstance()
      this.initCharts()
    }

    // 支持两种加载方式
    if (this.props.deps && this.props.deps.length) {
      this.loadLibs().then(() => {
        init()
      })
    } else {
      setTimeout(() => {
        init()
      }, 0);
    }
  }
  
  componentWillUnmount() {
    // 需要清理所有的事件监听器和定时器
    if (this.hisTimer) {
      clearTimeout(this.hisTimer);
    }
    if (this.symbolSetTimer) {
      clearTimeout(this.symbolSetTimer);
    }
    // 清理图表实例
    if (this.tvwidget) {
      try {
        this.clearLines();
        this.tvwidget.remove();
        this.tvwidget = null;
      } catch (error) {
        console.error('componentWillUnmount:', error);
      }
    }
  }

  reload() {
    this.chartIsReady = false
    this.drawHisCatchTimes = 0
    if (this.tvwidget) {
      this.clearLines()
      if (this.hisTimer) {
        clearTimeout(this.hisTimer)
      }
      try {
        this.tvwidget.remove()
        this.tvwidget = null
        setTimeout(() => {
          this.tvwidget = new window.TradingView.widget(this.getTvConfig())
          this.exportInstance()
          this.initCharts()
        }, 0)
        setTimeout(() => {
          this.exportInstance()
        }, 1000)
      } catch (error) {
        console.log('tvwidget remove error')
      }
    }
  }
  exportInstance() {
    try {
      window.TradingView.instance = this.tvwidget
      window.TradingView.instance.changeTvTheme = this.changeTvTheme.bind(this)
      window.TradingView.instance.reload = this.reload.bind(this)
      window.TradingView.instance.resHandler = this.props.resHandler
      window.TradingView.instance.drawLines = this.drawLines.bind(this)
      window.TradingView.instance.drawHisShape = this.drawHisShape.bind(this)
      this.setPricePrecision()
      this.setSymbol()
    } catch (error) {

    }
  }
  clearLines() {
    this.clearPositions()
    this.orderList = []
    this.tpslOrderList = []
    this.triggerOrderList = []
    this.hisOrderList = []
  }
  drawLines() {
    this.tvwidget && this.tvwidget.onChartReady(() => {
      this.clearPositions()
      this.drawPositions()
      this.drawOpenOrders()
      this.drawTpslOrders()
      this.drawTriggerlOrders()
    })
  }
  drawHisShape() {
    this.tvwidget && this.tvwidget.onChartReady(() => {
      this.clearHisOrders()
      this.drawHisOrders()
    })
  }
  setPricePrecision() {
    setTimeout(() => {
      if (window.TradingView && window.TradingView.instance) {
        window.TradingView.instance.pricePrecision = this.props.pricePrecision
      }
    }, 0)
  }
  setSymbol() {
    if (!this.chartIsReady || !this.tvwidget) {
      // 如果图表未就绪，设置一个短暂的重试
      if (this.symbolSetTimer) {
        clearTimeout(this.symbolSetTimer);
      }
      this.symbolSetTimer = setTimeout(() => {
        this.setSymbol();
      }, 1000);
      return;
    }
    
    try {
      this.tvwidget.setSymbol(this.symbol, this.state.interval, function (res) { })
    } catch (error) {
      console.error('setSymbol:', error);
    }
  }

  render() {
    return (
      <Spin spinning={!this.chartIsReady} wrapperClassName="chart-spin">
        <div id="tv_charts" className='h-p100 bg-card'>
          <Stacks type="01" hfull>
            <TVMenus chartIsReady={this.chartIsReady} menus={this.menus} tvwidget={this.tvwidget} klineModelData={this.props.kline} mp={this.props.mp} setInterval={this.setInterval.bind(this)} interval={this.state.interval} filterStorage={this.props.filterStorage} klineStorage={this.storage} lineFilterOptions={this.props.lineFilterOptions || {}} />
            <div id="tv_chart_container" />
          </Stacks>
          {this.props.watermark && <div className='trendingview_watermark'>{this.props.watermark}</div>}
        </div>
      </Spin>
    )
  }
}

// k线工具栏
class TVMenus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullScreenStatus: false
    };
    this.fullScreenElement = null;
    this.onFullScreenChange = this.onFullScreenChange.bind(this);
  }

  componentDidMount() {
    // 检查是否支持全屏API
    if (document.fullscreenEnabled) {
      document.addEventListener('fullscreenchange', this.onFullScreenChange);
      this.fullScreenElement = document.documentElement;
    }
  }

  componentWillUnmount() {
    if (this.fullScreenElement) {
      this.fullScreenElement = null;
    }
    document.removeEventListener('fullscreenchange', this.onFullScreenChange);
  }

  onFullScreenChange() {
    if (!document.fullscreenElement) {
      this.setState({ fullScreenStatus: false });
      document.getElementById('tv_charts').classList.remove('tv_charts_fullscreen');
      this.fullScreenElement = null;
    } else if (!this.fullScreenElement) {
      // 如果变为全屏，添加事件监听
      this.fullScreenElement = document.fullscreenElement;
    }
  }

  get tvwidget() {
    return this.props.tvwidget
  }
  get klineModelData() {
    return this.props.klineModelData
  }
  get filterStorage() {
    return this.props.filterStorage || {}
  }
  get klineStorage() {
    return this.props.klineStorage || {}
  }
  get lineFilterOptions() {
    return this.props.lineFilterOptions || {}
  }

  stateChange(state = {}) {
    actions.changeItem({ id: this.props.mp ? 'MPkline' : 'kline', ...state })
  }

  filtersChange(filters = {}) {
    this.stateChange({ filters: filters })
    this.filterStorage.setCurrent && this.filterStorage.setCurrent(filters)
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps?.chartIsReady) {
      this.tvwidget && this.tvwidget.onChartReady(() => {
        this.tvwidget.chart().setChartType(!nextProps.klineModelData.isTime ? nextProps?.klineModelData?.lineType  : 2)
      })
      return true;
    }
    return false;
  }

  renderActionMenu(item) {
    const link = "hover-fc-grey center-vh"
    const executeAction = (id) => {
      this.tvwidget && this.tvwidget.onChartReady(() => {
        this.tvwidget.chart().executeActionById(id)
      })
    }
    return (
      <Text type="1-light" className={link} onClick={() => executeAction(item.value)}>
        {item.value === 'insertIndicator' && <div className={`index`} >{item.text}</div>}
        {item.value === 'chartProperties' && <Icon className="iui-icon fs14" type="setting" />}
      </Text>
    )
  }

  renderFullScreenMenu() {
    const link = "hover-fc-grey center-vh"
    const fullScreen = () => {
      try {
        const tvid = document.getElementById("tv_charts")
        var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
        if (!isFullscreen) {//进入全屏,多重短路表达式
          (tvid.requestFullscreen && tvid.requestFullscreen()) ||
            (tvid.mozRequestFullScreen && tvid.mozRequestFullScreen()) ||
            (tvid.webkitRequestFullscreen && tvid.webkitRequestFullscreen()) ||
            (tvid.msRequestFullscreen && tvid.msRequestFullscreen())
        }
        tvid.style.height = '100%'
        tvid.style.width = '100%'
        this.setState({ fullScreenStatus: true })
        // 处理兼容问题
        if (window?.innerWidth < 1024) {
          document.getElementById('tv_charts').classList.add('tv_charts_fullscreen');
        }
      } catch (e) { }
    }

    const fullScreenCancel = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .catch(err => {
            console.error(err);
          });
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      this.setState({ fullScreenStatus: false })
      document.getElementById('tv_charts').classList.remove('tv_charts_fullscreen');
    }

    return (
      <Text className={link} onClick={this.state.fullScreenStatus ? fullScreenCancel : fullScreen}>
        <i className={`iui-icon ${this.state.fullScreenStatus ? 'iui-icon-shrink' : 'iui-icon-expand'} fs14 cursor-pointer fc-grey-light hover-fc-grey`}></i>
      </Text>
    )
  }

  // K线类型选项
  renderLineTypeMenu(item) {
    const { options } = item
    const setLineType = (value) => {
      this.tvwidget && this.tvwidget.onChartReady(() => {
        this.tvwidget.chart().setChartType(value)
      })
      this.stateChange({ lineType: value })
    }
    const chartTypeContent = <div className="kline-chart-type-items bg-layer h-p100 pt5 pb5 br-1">
      {
        lineTypeOptions.map((item, index) => {
          return <div key={index} onClick={() => setLineType(item.value)} className={`kline-chart-type-item ${this.klineModelData.lineType === item.value ? 'is-active fc-primary' : 'fc-grey'}`}>{item.label}</div>
        })
      }
    </div>

    if (options && options.length) {
      return (
        <>
          {this.state.fullScreenStatus && <Popover
            content={chartTypeContent}
            getPopupContainer={() => document.getElementById('tv_charts')}
            overlayClassName="kline-chart-type-layer"
            placement="bottomLeft"
            autoAdjustOverflow={false}
          >
            <div className='cursor-pointer'>
              <i className="iui-icon iui-icon-candle fs14 fc-grey-light hover-fc-grey"></i>
            </div>
          </Popover>}
          {!this.state.fullScreenStatus && <Popover
            content={chartTypeContent}
            overlayClassName="kline-chart-type-layer"
            placement="bottomLeft"
            autoAdjustOverflow={false}
          >
            <div className='cursor-pointer'>
              <i className="iui-icon iui-icon-candle fs14 fc-grey-light hover-fc-grey"></i>
            </div>
          </Popover>}
        </>

      )
    } else {
      return null
    }
  }

  renderMenu(item) {
    const { type } = item
    switch (type) {
      case 'action':
        return this.renderActionMenu(item)
      case 'lineType':
        return this.renderLineTypeMenu(item)
      default:
        return null
    }
  }

  render() {
    const SUPPORTED = ['-1', '1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M']
    const filters = this.klineModelData.filters || {} //订单线、仓位线筛选项
    const timeFiler = this.klineModelData.timeFiler || [] //可切换的时间按钮筛选项
    // 订单线、仓位线筛选项
    const filterContent = (
      <div className='filterlist'>
        <div className='iui-c-t1 fs12 lh-15'>{$t('Order Display')}</div>
        <div className="row">
          {this.lineFilterOptions.position && <div className='col-6 mt15'><Checkbox checked={filters.position} onChange={evt => {
            let updated = { ...filters, position: evt.target.checked }
            this.filtersChange(updated)
          }} className='fs12'><span className={filters.position ? 'fc-grey' : 'fc-grey-light'}>{$t('Positions')}</span></Checkbox></div>}
          {this.lineFilterOptions.order && <div className='col-6 mt15'><Checkbox checked={filters.order} onChange={evt => {
            let updated = { ...filters, order: evt.target.checked }
            this.filtersChange(updated)
          }} className='fs12'><span className={filters.order ? 'fc-grey' : 'fc-grey-light'}>{$t('Open Orders')}</span></Checkbox></div>}
          {this.lineFilterOptions.triggerOrder &&<div className='col-6 mt15'><Checkbox checked={filters.triggerOrder} onChange={evt => {
            let updated = { ...filters, triggerOrder: evt.target.checked }
            this.filtersChange(updated)
          }} className='fs12'><span className={filters.triggerOrder ? 'fc-grey' : 'fc-grey-light'}>{$t('Trigger Orders')}</span></Checkbox></div>}
          {this.lineFilterOptions.tpslOrder && <div className='col-6 mt15'><Checkbox checked={filters.tpslOrder} onChange={evt => {
            let updated = { ...filters, tpslOrder: evt.target.checked }
            this.filtersChange(updated)
          }} className='fs12'><span className={filters.tpslOrder ? 'fc-grey' : 'fc-grey-light'}>{$t('TP/SL Orders')}</span></Checkbox></div>}
          {this.lineFilterOptions.historyOrder && <div className='col-12 mt15'><Checkbox checked={filters.historyOrder} onChange={evt => {
            let updated = { ...filters, historyOrder: evt.target.checked }
            this.filtersChange(updated)
          }} className='fs12'><span className={filters.historyOrder ? 'fc-grey' : 'fc-grey-light'}>{$t('Historical Orders')}</span></Checkbox></div>}
        </div>
      </div>
    )

    // 选择可切换时间
    const timerfilerChange = (evt, value) => {
      let { checked } = evt.target
      let constructed = []
      if (checked) {
        for (let i = 0; i < timeFiler.length; i++) {
          let current = timeFiler[i]
          if ((SUPPORTED.indexOf(current) > SUPPORTED.indexOf(value)) && !constructed.includes(value)) {
            constructed.push(value)
          }
          constructed.push(current)
        }
        if (!constructed.includes(value)) {
          constructed.push(value)
        }
      } else {
        constructed = timeFiler.filter(self => self !== value)
      }
      this.filterStorage.updateTimefiler(constructed)
      this.stateChange({ timeFiler: constructed })
    }

    const isInLast = resolution => {
      if (['1D', '1M', '1W'].indexOf(resolution) != -1) {
        return true
      }
      return false
    }

    const translatedConvert = resolution => {
      if (isInLast(resolution)) {
        return $t(resolution)
      }
      return `${resolution.slice(0, -1)}${$t(resolution.slice(-1))}`
    }
    // 展示的可切换时间按钮筛选
    const timeFilterContent = (
      <div className='bg-layer h-p100 p16 br-1'>
        <div className='title fc-grey'>{$t('Select intervals')}</div>
        <div className='wrap'>
          {
            SUPPORTED.map((value, index) => {
              let checked = false
              if (timeFiler.find(self => self === value)) {
                checked = true
              }
              return (
                <div key={index} className='select-intervals-field'>
                  <Checkbox className="fc-grey-light" defaultChecked={checked} onChange={evt => timerfilerChange(evt, value)}>
                    <span className={checked ? 'fc-grey' : 'fc-grey-light'}>{(index == 0) ? $t('TVTime') : translatedConvert((isInLast(value) ? '1' : '') + this.klineStorage.getResolution(value))}</span>
                  </Checkbox>
                </div>
              )
            })
          }
        </div>
      </div>
    )

    // 点击分时按钮
    const doTimeSelected = () => {
      this.tvwidget && this.tvwidget.onChartReady(() => {
        this.props.setInterval('1')
        this.tvwidget.chart().setChartType(2)
      })
      this.stateChange({ isTime: true, chartType: 2 })
    }
    // 切换Interval
    const changeInterval = (value) => {
      const lineType = this.klineModelData.lineType
      this.tvwidget && this.tvwidget.onChartReady(() => {
        this.props.setInterval(value)
        this.tvwidget.chart().setChartType(lineType)
        this.stateChange({ isTime: false, chartType: lineType })
      })
    }

    return (
      <Cols between className="kline-header bc-grey-light panel-subheader">
        <Cols className="kline-header-settings sh-4-diy">
          {
            timeFiler.map(value => {
              // 分时按钮
              if (value === '-1') {
                return (
                  <Text key={value} type={this.klineModelData.isTime ? '1' : '1-light'} className="hover-fc-grey" onClick={doTimeSelected}>
                    {$t('TVTime')}
                  </Text>
                )
              }
              // 时间按钮
              return (
                <Text key={value} type={(this.props.interval == value && !this.klineModelData.isTime) ? '1' : '1-light'} className="hover-fc-grey" onClick={() => changeInterval(value)}>
                  {translatedConvert((isInLast(value) ? '1' : '') + this.klineStorage.getResolution(value))}
                </Text>
              )
            })
          }
          {/* 分时按钮 */}
          {(!timeFiler.includes('-1') && this.klineModelData.isTime) && <Text type="1">{$t('TVTime')}</Text>}
          {/* 时间按钮 */}
          {(this.props.interval && !timeFiler.includes(this.props.interval + '') && !this.klineModelData.isTime) && <Text type="1">{translatedConvert((isInLast(this.props.interval) ? '1' : '') + this.klineStorage.getResolution(this.props.interval))}</Text>}
          {/* 下拉菜单 */}
          <Popover
            content={timeFilterContent}
            getPopupContainer={() => document.getElementById('tv_charts')}
            overlayClassName="timefilteroverlay"
            placement="bottomLeft"
            autoAdjustOverflow={false}
          >
            <div>
              <i className="iui-icon iui-icon-chevron-down fs14 cursor-pointer fc-grey-light hover-fc-grey"></i>
            </div>
          </Popover>
          {
            this.props.menus.map((menu, index) => (
              <React.Fragment key={menu.value || index}>
                {this.renderMenu(menu)}
              </React.Fragment>
            ))
          }
        </Cols>
        {/* 右侧订单线、仓位线筛选项 */}
        <div className='filter-right cursor-pointer'>
          {JSON.stringify(this.lineFilterOptions) === '{}' ? null : <Popover
            content={filterContent}
            getPopupContainer={() => document.getElementById('tv_charts')}
            overlayClassName="lineFilterContent"
            placement="bottomRight"
          >
            <i className="iui-icon iui-icon-sliders fc-grey-light hover-fc-grey fs14 cursor-pointer"></i>
          </Popover>}
          {this.renderFullScreenMenu()}
        </div>
      </Cols>
    )
  }
}

export const initTime = (menus, interval, subType) => {
  const menu = (menus || TradingViewWidget.defaultProps.menus).find(menu => menu.subType === subType)
  let label

  if (menu && menu.options) {
    menu.options.forEach(item => {
      if (item.value === interval) {
        label = item.label
      }
    })
  }

  return label
}

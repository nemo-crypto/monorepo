import { Button, Cols, Icon, Text, Stacks, Title, Cell} from '@xatom/uikits'
import React, { useState, useEffect, useReducer, useContext } from 'react'
import $t from '@xatom/intl'
import { getMode } from '@xatom/utils/src/themes'
import './index.less'

export default function Widget (props) {
  const mode = getMode()
  let { ptH, emptyText = $t('No Record') } = props
  return (
    <div className="empty" style={{paddingTop: ptH || 0}}>
      <img src={`https://cdn.test.mobi/common/empty/table-empty-${mode}.png`} alt="" width={64} height={72}/>
      <div className="fc-grey-light mt15 fs14">{emptyText}</div>
    </div>
  )
}
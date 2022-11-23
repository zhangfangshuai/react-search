import React, { Component } from 'react'

import welcomeGif from '../../assets/images/welcome.gif'
import './list.css'

export default class Welcome extends Component {
    render() {
        return (
            <div className='list-welcome'>
                <div className='list-welcome-tip'>欢迎使用GitHub用户搜索工具，请输入关键字开始使用吧！</div>
                <img src={welcomeGif} alt="欢迎访问" />
            </div>
        )
    }
}

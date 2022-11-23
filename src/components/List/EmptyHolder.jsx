import React, { Component } from 'react'
// 当前没有在webpack没有配置loader或webpack5的type，因此webpack不是被JSX的src路径，只能通过模块导入来引入图片
import avatarImg from '../../assets/images/avatar_miki.webp'

export default class EmptyHolder extends Component {
  render() {
    return (
        <section>
            <img src={avatarImg} alt="avatar" />
            <p>～暂无任何成员～</p>
        </section>
    )
  }
}

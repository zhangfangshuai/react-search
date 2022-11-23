import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
import './search.css'

export default class Search extends Component {

    // 用户点击搜索的回调
    handleSearch = () => {
        const { Search } = this.props.PubSubTopics
        let { value: keyword } = this.keywordEle
        keyword = keyword.trim()
        // 未输入，不搜索
        if (keyword === '') return
        // 关闭欢迎页，显示loading
        PubSub.publish(Search, { isFirst: false, isLoading: true, err: '' })
        // 调用axios，发起Ajax请求获取数据
        axios.get(`https://api.github.com/search/users?q=${keyword}`).then(res => {
            const { status, data, statusText } = res || {}
            if (status === 200) {
                // 关闭loading，展示数据
                PubSub.publish(Search, { isLoading: false, users: data.items, err: '' })
            } else {
                throw new Error(statusText)
            }
        }).catch(e => {
            // 关闭loading，现实错误
            PubSub.publish(Search, { isLoading: false, err: e.message })
        })
    }

    render() {
        return (
            <div className="search">
                <header>GitHub用户搜索<small>（点击头像进入git主页）</small></header>
                <input ref={cNode => this.keywordEle = cNode} type="text" placeholder="请输入Git仓库用户名" />
                <button onClick={this.handleSearch}>搜索</button>
            </div>
        )
    }
}

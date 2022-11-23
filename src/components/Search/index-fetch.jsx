import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './search.css'

export default class Search extends Component {

    // 用户点击搜索的回调
    handleSearch = async () => {
        const { Search } = this.props.PubSubTopics
        let { value: keyword } = this.keywordEle
        keyword = keyword.trim()
        // 未输入，不搜索
        if (keyword === '') return
        // 关闭欢迎页，显示loading
        PubSub.publish(Search, { isFirst: false, isLoading: true, err: '' })
        const api = `https://api.github.com/search/users?q=${keyword}`

        // 常规的fetch写法
        /*
        fetch(api).then(res => {
            console.log('联系服务器成功了')
            if (res.status === 200) {
                return res.json()
            } else {
                // .then函数出现链式调用，如果当前.then返回非Promise，则该数据直接作为下一个.then的入参。
                // 如果当前.then返回Promise，则该Promise的响应结果作为下一个.then的入参。
                // return {}
                throw new Error(`状态码：${res.status}，响应信息：${res.statusText || '未提供'}，错误接口；${res.url}`)
            }
        }).then(res => {
            PubSub.publish(Search, { isLoading: false, users: res.items, err: '' })
        }).catch(error => {
            PubSub.publish(Search, { isLoading: false, err: error.message })
        })
        */

        // fetch写法的最佳实践
        try {
            const linkServer = await fetch(api)
            const res = await linkServer.json()
            PubSub.publish(Search, { isLoading: false, users: res.items, err: '' })
        } catch (error) {
            PubSub.publish(Search, { isLoading: false, err: error.message })
        }
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

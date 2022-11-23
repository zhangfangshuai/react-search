import React, { Component } from 'react'

import Search from './components/Search'
import List from './components/List'
import './App.css'

export default class App extends Component {

    state = {
        // 发布订阅的消息管理器
        PubSubTopics: {
            Search: 'Search'
        }
    }

    render() {
        const { PubSubTopics } = this.state
        return (
            <div className="app">
                <Search PubSubTopics={PubSubTopics} />
                <List PubSubTopics={PubSubTopics} />
            </div>
        )
    }
}

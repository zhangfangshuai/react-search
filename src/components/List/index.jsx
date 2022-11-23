import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './list.css'

import Welcome from './Welcome'
import Loading from './Loading'
import Error from './Error'
import EmptyHolder from './EmptyHolder'

export default class List extends Component {

    state = {
        users: [],
        isFirst: true, // 首登欢迎页
        isLoading: false, // Ajax请求执行中
        err: '', // 请求错误信息
    }

    componentDidMount() {
        const { Search } = this.props.PubSubTopics
        PubSub.subscribe(Search, (_, stateObj) => {
            this.setState(stateObj)
        })
    }

    render() {
        const { users, isFirst, isLoading, err } = this.state
        return (
            <div className="user-list">
                {
                    isFirst ? <Welcome /> :
                    isLoading ? <Loading /> :
                    err ? <Error err={err} /> :
                    !users || users.length === 0 ? <EmptyHolder /> :
                    users.map(user => {
                        return (
                            <section key={user.id}>
                                <a href={user.html_url} target="_blank" rel="noreferrer">
                                    <img src={user.avatar_url} alt="avatar" />
                                </a>
                                <p>{user.login}</p>
                            </section>
                        )
                    })
                }
            </div>
        )
    }
}

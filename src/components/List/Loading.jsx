import React, { Component } from 'react'
import './list.css'

export default class Loading extends Component {
    render() {
        return (
            <div className="list-load">
                <div className="list-load-animater">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className='list-load-txt'>正在搜索用户...</div>
            </div>
        )
    }
}

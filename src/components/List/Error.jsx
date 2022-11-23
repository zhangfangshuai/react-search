import React, { Component } from 'react'
import './list.css'

export default class Error extends Component {
    render() {
        return (
            <div className='list-error'>
                <h1>Oops! There seems to be some problems!</h1>
                <p style={{ color: 'red' }}>{this.props.err}</p>
            </div>
        )
    }
}

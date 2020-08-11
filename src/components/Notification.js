import React from 'react'

const Notification = ({message, errorMessage}) => {
    const messageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const errorMessageStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message===null && errorMessage===null) {
        return null
    }

    if (errorMessage!==null) {
        return (
            <div style={errorMessageStyle}>
            {errorMessage}
        </div>
        )
    }
    return (
        <div style={messageStyle}>
            {message}
        </div>

    )
}

export default Notification
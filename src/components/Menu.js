import React, { PropTypes } from 'react'
// import { connect } from 'react-redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class Menu extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render () {
    const { handle, loggedIn } = this.props.user
    let loginButton

    if (loggedIn) {
      loginButton = <a href='javascript:alert("todo")'>Logout</a>
    } else {
      loginButton = (
        <a href='http://localhost:3000/request_token'>
          Sign in with Github
        </a>
      )
    }

    return (
      <div id='menu' className='navbar navbar-static-top navbar-inverse'>
        <div className='container'>
          <ul className='nav navbar-nav'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About</Link></li>
            <li>{loginButton}</li>

          </ul>
          {loggedIn && (
            <p className='navbar-text pull-right'>
              Signed in as {handle}
            </p>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return ({
    user: state.user
  })
}

export default connect(mapStateToProps, null)(Menu)

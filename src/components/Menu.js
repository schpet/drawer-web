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
    console.log(this.prop)
    let loginButton

    if (loggedIn) {
      loginButton = <span>TODO: logout</span>
    } else {
      loginButton = <a href='http://localhost:3000/request_token'>Login</a>
    }

    return (
      <div id='menu'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About</Link></li>
          <li>{loginButton}</li>
          <li>{handle}</li>
        </ul>
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

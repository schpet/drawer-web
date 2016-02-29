import React, { PropTypes } from 'react'
// import { connect } from 'react-redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { signOutAndClearJWT } from 'redux/modules/user'

class Menu extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    signOutAndClearJWT: PropTypes.func.isRequired
  }

  render () {
    const { handle, loggedIn } = this.props.user
    const { signOutAndClearJWT } = this.props
    const signInUrl = `${DRAWER_API_URL}/request_token`

    return (
      <div id='menu' className='navbar navbar-static-top navbar-inverse'>
        <div className='container'>
          <ul className='nav navbar-nav'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About</Link></li>
          </ul>

          <ul className='nav navbar-nav navbar-right'>
            {loggedIn && (
              <li><a onClick={signOutAndClearJWT}>Logout</a></li>
            )}
            {!loggedIn && (
              <li><a href={signInUrl}>Sign in with Github</a></li>
            )}
            {handle && (
              <li>
                <p className='navbar-text'>
                  Signed in as {handle}
                </p>
              </li>
            )}
          </ul>
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

export default connect(mapStateToProps, {
  signOutAndClearJWT
})(Menu)

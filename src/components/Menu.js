import React, { PropTypes } from 'react'
// import { connect } from 'react-redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadUser, signOutAndClearJWT } from 'redux/modules/user'

class Menu extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    signOutAndClearJWT: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.loadUser()
  }

  render () {
    const { handle, loggedIn } = this.props.user
    const { signOutAndClearJWT } = this.props
    const signInUrl = `${DRAWER_API_URL}/request_token`

    return (
      <div id='menu' className='navbar navbar-static-top navbar-inverse'>
        <div className='container'>
          <Link to='/' className='navbar-brand'>
            Drawer
          </Link>

          <ul className='nav navbar-nav'>
            <li><Link to='/about'>About</Link></li>
          </ul>

          <ul className='nav navbar-nav navbar-right'>
            {loggedIn && (
              <li>
                <button type='button'
                  className='btn btn-link navbar-btn'
                  onClick={signOutAndClearJWT}>
                  Logout
                </button>
              </li>
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
  signOutAndClearJWT,
  loadUser
})(Menu)

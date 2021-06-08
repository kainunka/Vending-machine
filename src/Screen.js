import React, { Component } from 'react';
import { connect } from 'react-redux'

class Screen extends Component {
  render() {
    return (
      <div className="screen">
        <p>Credits: {this.props.credit}$</p>
        <p>Your Pick: {this.props.query}</p>
        <p className="messageShow">{this.props.message}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  credit: state.vendingMachine.credit,
  message: state.vendingMachine.message
})

export default connect(mapStateToProps)(Screen);

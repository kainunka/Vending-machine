import React, { Component } from 'react'
import { connect } from 'react-redux'
import _isUndefined from 'lodash/isUndefined';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }


  render() {
    return (
      <div className="vendingMachineApp">
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.items
})
export default connect(mapStateToProps)(App);

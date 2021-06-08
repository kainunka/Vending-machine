import React, { Component } from 'react';
import { connect } from 'react-redux'
import FrontPanel from './FrontPanel'
import _ from 'lodash'
import './App.scss';
import img0 from './assets/images/0.jpeg'

class App extends Component {
  constructor() {
    super()
    this.state = {
      fromChildQuery: "",
      fromChildCredits: 0
    }
  }
  handleDataQuery = (data) => {
    this.setState({
      fromChildQuery: data
    });
  }

  renderItem = () => {
    let { items } = this.props

    return _.map(items, (value, key) => {
        return (
          <li key={ value.id } className={ `text product-0`} id={ value.id }>
             <span className="codeProduct">CODE : {value.id}</span>
             <br />
             { value.max > 0 ?
              <img src={ value.img } width="100" height="110" /> 
              : 
              <img src={ img0 } width="100" height="110" /> 
              }
            <br />
            <span className="priceProduct">
              Price {value.price}$
              <br />
              Stock : {value.max}</span>
          </li>
        )
    })
  }
  
  render() {
    return (
      <div className="App">
        <header className="title">Vending machine</header>
        <div className="glass">
          <ul className="grid-9">
              { this.renderItem() }
          </ul>
        </div>
        <FrontPanel 
          handlerFromParent={this.handleDataQuery}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
  items: state.vendingMachine.items
})
export default connect(mapStateToProps)(App);

import React, { Component } from 'react';
import Screen from './Screen'
import { connect } from 'react-redux'
import _ from 'lodash'
import { SETCREDIT, SETMESSAGE, SETCURRENTITEM, SETITEMS } from './redux/store/constants/types'

class FrontPanel extends Component {
  constructor(){
    super()
    this.clearMessage = this.clearMessage.bind(this);
    this.state = {
        query: "",
        amountCredit: ""
    }
  }


clearScreen = () => {
    this.setState({
      query: "",
    })
    this.props.onSetCredit(0)
    this.props.onSetMessage("Please select a product!")
  }

addCredit = () => {
  let { amountCredit } = this.state
  let { credit } = this.props
  if (_.toNumber(amountCredit) > 0) {
    credit = credit + amountCredit
    this.props.onSetCredit(credit)
  }
}

addToQuery = (id) => {
    this.setState(prevState => ({
      query: prevState.query + id
    }), () => {
       this.onChangeQuery()
    })
}


onChangeQuery = () => {
  this.props.handlerFromParent(this.state.query)
}

calculateRest = (money, cost) => {
  let newCredit = money - cost;
  this.props.onSetCredit(newCredit)
}


clearQuery = () => {
    this.setState({
      query: ""
    })
}

clearMessage = () => {
  this.props.onSetMessage("Please select a product!")
}

buyMessage = () => {
  this.props.onSetMessage("Thank you for your purchase!")
  setTimeout( () => {
    this.clearMessage()
  },2000)
  }

changeProduct = (id) => {
  const { items } = this.props
  let findItem = _.find(items, { id })

  if (findItem) {
    this.props.onSetCurrentItem(findItem.img)
  }
}

resetProduct = () => {
 this.props.onSetCurrentItem("")
}


buy = () => {
  const { items, credit } = this.props
  let currentQuery = this.state.query
  let product = items.filter(number => number.id === currentQuery);
  let money = credit;

  if (product && product[0] && money >= product[0].price) {
    if (product[0].max > 0) {
      this.calculateRest(money, product[0].price);
      this.clearQuery();
      this.buyMessage();
      this.changeProduct(currentQuery);
  
      let fineIndex = _.findIndex(items, { id: currentQuery })
      if (fineIndex !== -1) {
        items[fineIndex].max = items[fineIndex].max - 1
        this.props.onSetItems(items)
      }
    } else {
      this.props.onSetMessage("This product is out of stock. ")
    }
  } else if(product.length !== 1){
    this.props.onSetMessage("Please choose a different product")
  } else {
    this.props.onSetMessage("You don't have enought money!")
  }
}

onChangeCredit = (e) => {
  this.setState({
    amountCredit: _.toNumber(e.target.value)
  })
}

render() {
  const { currentItem } = this.props
  let { amountCredit } = this.state

  return (
    <div>

        <Screen
          query={this.state.query}
          message={this.state.message}/>

        <div className="keybord-layout">
          <div className="keybord">
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="1">1</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="2">2</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="3">3</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="4">4</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="5">5</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="6">6</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="7">7</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="8">8</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="9">9</button>
            <button className="button" onClick={e => this.addToQuery(e.target.id)} id="0">0</button>
          </div>
        </div>

        <div className='buttons'>
          <input className="amount" min={ 0 } value={ amountCredit } type="number" placeholder="Enter credit" onChange={(e) => this.onChangeCredit(e)} />
          <button className="button" onClick={this.addCredit}>Add Credit</button>
          <button className="button" onClick={this.clearScreen}>Clear All</button>
          <button className="button" onClick={this.buy}>Enter</button>
          <button className="button" onClick={this.clearQuery}>Clear Selection</button>
        </div>

        
        <div className="opening" onClick={this.resetProduct} title="Click me to grab product">
          {
            currentItem !== "" ?
            <img src={currentItem} width="100" height="110" />
            :
            null
          }
        </div>
    </div>
  )
}
}

const mapStateToProps = (state) => ({
  items: state.vendingMachine.items,
  credit: state.vendingMachine.credit,
  currentItem: state.vendingMachine.currentItem
})

const mapDispatchToProps = (dispatch) => ({
  onSetItems: (active) => dispatch({ type: SETITEMS, active }),
  onSetCredit: (active) => dispatch({ type: SETCREDIT, active }),
  onSetMessage: (active) => dispatch({ type: SETMESSAGE, active }),
  onSetCurrentItem: (active) => dispatch({ type: SETCURRENTITEM, active })
});

export default connect(mapStateToProps, mapDispatchToProps)(FrontPanel);

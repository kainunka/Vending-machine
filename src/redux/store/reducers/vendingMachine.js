import img1 from '../../../assets/images/1.jpeg'
import img2 from '../../../assets/images/2.jpeg'
import img3 from '../../../assets/images/3.jpeg'
import img4 from '../../../assets/images/4.jpeg'
import img5 from '../../../assets/images/5.jpeg'
import img6 from '../../../assets/images/6.jpeg'
import img7 from '../../../assets/images/7.jpeg'
import img8 from '../../../assets/images/8.jpeg'
import img9 from '../../../assets/images/9.jpeg'
import { SETCREDIT, SETITEMS, SETMESSAGE, SETCURRENTITEM } from '../constants/types'

const defaultState = {
  items: [{
    id: "1",
    price: 2,
    max: 10,
    img: img1
  }, {
    id: "2",
    price: 1,
    max: 5,
    img: img2
  },{
    id: "3",
    price: 5,
    max: 6,
    img: img3
  },{
    id: "4",
    price: 4,
    max: 7,
    img: img4
  },{
    id: "5",
    price: 2.5,
    max: 2,
    img: img5
  },{
    id: "6",
    price: 8,
    max: 3,
    img: img6
  },{
    id: "7",
    price: 6.5,
    max: 1,
    img: img7
  },{
    id: "8",
    price: 5,
    max: 5,
    img: img8
  },{
    id: "9",
    price: 4.5,
    max: 7,
    img: img9
  }],
  credit: 0,
  message: "Please select a product!",
  currentItem: ""
};

const setItems = (state, action) => ({
  ...state,
  items: action.active
});

const setCredit = (state, action) => ({
  ...state,
  credit: action.active
});

const setMessage = (state, action) => ({
  ...state,
  message: action.active
})

const setCurrentItem = (state, action) => ({
  ...state,
  currentItem: action.active
})


export default function vendingMachine(state = defaultState, action) {

  switch (action.type) {
    case SETITEMS: {
      return setItems(state, action);
    }

    case SETCREDIT: {
      return setCredit(state, action);
    }
   
    case SETMESSAGE: {
      return setMessage(state, action)
    }

    case SETCURRENTITEM: {
      return setCurrentItem(state, action)
    }

    default: {
      return state;
    }
  }
}


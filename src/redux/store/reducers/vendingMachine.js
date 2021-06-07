const actionTypes = {
  GETITEM: 'getItems',
};

const defaultState = {
  items: []
};

const setItems = (state, action) => ({
  ...state,
  items: action.active
});


export default function vendingMachine(state = defaultState, action) {

  switch (action.type) {
    case actionTypes.GETITEM: {
      return setItems(state, action);
    }
   
    default: {
      return state;
    }
  }
}


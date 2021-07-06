import {createStore, applyMiddleware} from 'redux';
import reduxLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import loggingMiddleware from 'redux-logger'
import axios from 'axios';
import { options } from '../../dataOptions';

// action types
const SET_DATA = 'SET_DATA';
const SET_SELECTION = 'SET_SELECTION'

//action creators
const updateSelected = (selection) => ({
  type: SET_SELECTION,
  selection
})

const gotData = (data) => ({
  type: SET_DATA,
  data
})

//thunk fetches data from usgs api
export const getData = (option) => {
  return async (dispatch) => {
    try {
      const url = options[option]
      const {data} = await axios.get(url)

      dispatch(gotData(data))
      dispatch(updateSelected(option))

    } catch (error) {
      console.log('Error fetching data: ', error)
    }
  }
}

const initialState = {active: "Day", data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {active: state.active, data: action.data};
    case SET_SELECTION:
      return {active: action.selection, data: state.data}
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(loggingMiddleware, thunkMiddleware));

export default store;
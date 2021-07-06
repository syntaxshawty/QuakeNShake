import React from 'react'
import {connect} from 'react-redux'
import {getData} from '../redux/store'
import { options } from '../../dataOptions'

const OptionsMenu = (props) => {

  //maps keys from Data options oject to input
  const mapOptions = (option, index) => {
    return (
      <label key={index} className="toggle-container">
        <input
          onChange={() => props.getData(option)}
          checked={option === props.active}
          name="toggle"
          type="radio"
        />
        <div className="toggle txt-s py3 toggle--active-white">
          {option}
        </div>
      </label>
    );
  };

  return (
    <div className='map-options'>
      <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
        {Object.keys(options).map(mapOptions)}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    active: state.active
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (op) => dispatch(getData(op)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenu);
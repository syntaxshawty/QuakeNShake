import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { getData } from '../redux/store'

const FeatureTable = (props) => {
  //puts data on state to filter locally
  const [data, setData] = useState(props.data);
  const [filter, setFilter] = useState({Time: 'NEW'})

  const filterByMagAsc = (a, b) => a.properties.mag - b.properties.mag
  const filterByMagDesc = (a, b) => b.properties.mag - a.properties.mag
  const filterByTimeAsc = (a, b) => a.properties.time - b.properties.time
  const filterByTimeDesc = (a, b) => b.properties.time - a.properties.time

  //updates data and filter on state
  const handleFilter = (e) => {
    const filterType = e.target.innerText.substr(0, e.target.innerText.indexOf(" "))
    if(filterType === 'Time'){
      if(filter['Time'] === 'NEW'){
        setFilter({[filterType]: 'OLD'})
        return setData(data.sort(filterByTimeAsc).slice())
      }else{
        setFilter({[filterType]: 'NEW'})
        return setData(data.sort(filterByTimeDesc).slice())
      }
    }else{
      if(filter['Magnitude'] === 'DESC'){
        setFilter({[filterType]: 'ASC'})
        return setData(data.sort(filterByMagAsc).slice())
      }else {
        setFilter({[filterType]: 'DESC'})
        return setData(data.sort(filterByMagDesc).slice())
      }
    }
  }

  const mapTableRows = (feature, index) => {
    try {
      var [lat, long] = feature.geometry.coordinates.slice();
      var location = feature.properties.place;
      var time = new Date(feature.properties.time);
      var mag = feature.properties.mag;
      return (
        <tr key={index}>
            <th scope="row">{mag.toFixed(2)}</th>
            <td>{location}</td>
            <td>{time.toString()}</td>
            <td>[{lat.toFixed(5)}, {long.toFixed(5)}]</td>
        </tr>
      );
    } catch (error) {
      console.log('Error reading feature data: ', feature, error)
    }
  };

  useEffect(() => {
    props.getData(props.active)
  }, [])

  useEffect(()=>{
    setData(props.data)
  }, [props.data])

  return data ? (
    <table id='table'>
      <thead>
        <tr>
        <th scope="col" onClick={(e) => handleFilter(e)}>Magnitude (⇅{filter.Magnitude})</th>
        <th scope="col">Location</th>
        <th scope="col" onClick={(e) => handleFilter(e)}>Time (⇅{filter.Time})</th>
        <th scope="col">Coordinates</th>
        </tr>
      </thead>
      <tbody>
      {data.map(mapTableRows)}
      </tbody>
    </table>
  ) : ('loading table data')
}

const mapStateToProps = (state) => {
  console.log('state: ', state)
  return {
    data: state.data.features,
    active: state.active
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (op) => dispatch(getData(op)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatureTable);
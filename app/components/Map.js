import React, {useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {addDataLayer, displayPopUp} from "../data-layer";
import {getData} from '../redux/store'
import { connect } from 'react-redux';

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3ludGF4c2hhd3R5IiwiYSI6ImNrcTYxeG56ZjB3aXkybnBmeXhnMG9maTEifQ.NnUQP5iapMH7nISWNW68YQ";

  const Map = (props) => {
    const mapContainerRef = useRef(null)
    const [map, setMap] = useState(null);

    useEffect(()=>{
      props.getData("Day")
    }, [])

    useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-50, 0],
      style: "mapbox://styles/mapbox/outdoors-v11",
      zoom: 1.5,
    });

    //creates and adds geocoder search bar to map
    //search generates marker and zooms in
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: "black",
      },
      mapboxgl: mapboxgl,
      zoom: 7,
    });

    map.addControl(geocoder);

    //adds zoom control feature to map
    map.addControl(new mapboxgl.NavigationControl());

    //initializes data layer on map once map loads
    map.on("load", () => {
      addDataLayer(map, props.data)
      setMap(map)
    });

    map.on("click", "earthquake-layer", function (e) {
      displayPopUp(e).addTo(map);
    });

    map.on("mouseenter", "earthquake-layer", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "earthquake-layer", function () {
      map.getCanvas().style.cursor = "";
    });

    return () => map.remove();

  }, []);

  //update data layer when active option changes
  useEffect(() => {
    if(map){
      map.getSource('earthquakes').setData(props.data)
      setMap(map)
    }
  }, [props.active])

  return (
<div>
  <div ref={mapContainerRef} className="map-container"/>
</div>
  )
  }

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (op) => dispatch(getData(op))
  }
}


const mapStateToProps = (state) => {
return {
  data: state.data,
  active: state.active
}
}



export default connect(mapStateToProps, mapDispatchToProps)(Map);
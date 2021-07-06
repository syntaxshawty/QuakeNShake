import React from 'react'
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import { Map, Table, OptionsMenu } from './components'

export default function App() {
  return (
    <div className="App">
        <Map />
        <OptionsMenu />
        <Table />
    </div>
  )
}
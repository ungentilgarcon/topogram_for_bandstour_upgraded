import React, { PropTypes } from 'react'
import ui from 'redux-ui'
import d3 from 'd3'
import { Map, TileLayer,ScaleControl,ZoomControl } from 'react-leaflet'
//import {smoothZoom} from 'leaflet.smoothzoom'

import 'leaflet/dist/leaflet.css'
import './GeoMap.css'

import mapTiles from './mapTiles'
import GeoNodes from './GeoNodes.jsx'
import GeoEdges from './GeoEdges.jsx'

const MAP_DIV_ID = 'map'
const divMapStyle = {
  position: 'fixed',
  top: '0',
  zIndex : -1
}

@ui()
class GeoMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      zoom : 2.4,
      position : [20.505, 22]
    }
  }

  static propTypes = {
    nodes : PropTypes.array,
    edges : PropTypes.array,
    width : PropTypes.string.isRequired,
    height : PropTypes.string.isRequired,
    selectElement : PropTypes.func.isRequired,
    unselectElement : PropTypes.func.isRequired,
    onFocusElement: PropTypes.func.isRequired,
    onUnfocusElement: PropTypes.func.isRequired
  }

  handleClickGeoElement({group, el}) {
    const {cy} = this.props.ui
    console.log("group",`${group}`);
    console.log("${el.data.id}",el.data.id);
    const filter = `${group}[id='${el.data.id}']`
    console.log(filter);
    const cyEl = cy.filter(filter)
    console.log(cyEl);
    cyEl.data('selected') ?
      this.props.unselectElement(cyEl.json())
      :
      this.props.selectElement(cyEl.json())
  }

  render() {
    const nodesById = {}

    const {
      geoMapTile,
      isolateMode,
      cy
    } = this.props.ui

    const {
      zoom,
      position
    } = this.state

    const {
      width,
      height,
      onFocusElement,
      onUnfocusElement
    } = this.props

    // resize dynamically using d3
    d3.select('.leaflet-container')
      .style('width', width)
    const left = width === '50vw' ? '50vw' : 0

    const nodes = this.props.nodes
      .map( n => {
        const coords = [n.data.lat,n.data.lng]
        const node = { ...n, coords }
        nodesById[n.data.id] = node // store for edges
        return node
      })

    const edges = this.props.edges
      .map( e => {
        const source = nodesById[e.data.source],
          target = nodesById[e.data.target],
          coords = [source.coords, target.coords],
          selected = e.data.selected
        return { ...e, source, target, coords, selected }
      })

    const {
      url,
      attribution,
      minZoom,
      maxZoom,
      ext
    } = mapTiles[geoMapTile]

    return (
      <div
        id={MAP_DIV_ID}
        style={Object.assign({}, divMapStyle,{ left, height })}
      >
        <Map
          center={position}
          zoom={zoom}
          zoomSnap= "0.01"
           zoomDelta= "0.05"
          zoomControl= {false}


          ref="map"
        >
          {
            edges.length ?
              <GeoEdges
                edges={edges}
                isolateMode={isolateMode}
                handleClickGeoElement={
                  (e)=>this.handleClickGeoElement(e)
                }
                onFocusElement={onFocusElement}
                onUnfocusElement={onUnfocusElement}
              />
              :
              null
          }
          {
            nodes.length ?
              <GeoNodes
                nodes={nodes}
                isolateMode={isolateMode}
                handleClickGeoElement={
                  (e) => this.handleClickGeoElement(e)
                }
                onFocusElement={onFocusElement}
                onUnfocusElement={onUnfocusElement}
              />
              :
              null
          }
          <TileLayer
            url={url}
            attribution={attribution}
            minZoom={minZoom}
            maxZoom={maxZoom}
            ext={ext}
          />
          <ScaleControl
            position='bottomright'
          />

        <ZoomControl
          position='bottomright'
          />
        </Map>
      </div>
    )
  }
}


GeoMap.defaultProps = {
  nodes : [],
  nodesReady : false,
  edges : [],
  edgesReady : false
}
export default GeoMap

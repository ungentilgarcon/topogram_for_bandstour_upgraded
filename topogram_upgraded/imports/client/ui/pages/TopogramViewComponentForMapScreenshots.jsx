import React, { PropTypes } from 'react'
import ui from 'redux-ui'

import MainViz from '/imports/client/ui/components/mainViz/MainViz.jsx'
//import TitleBox from '/imports/client/ui/components/titlebox/TitleBox.jsx'
//import SidePanel from '/imports/client/ui/components/SidePanel/SidePanel.jsx'

//import FloatingActionButton from 'material-ui/FloatingActionButton';
//import ExploreIcon from 'material-ui/svg-icons/action/explore';
import '../../../css/TopogramViewComponent.css'

// UI state default values
@ui({
  state: {
    filterPanelIsOpen: false,
    // filters
    minTime : null,
    maxTime : null,
    minWeight : null,
    maxWeight : null,
    // currentSliderTime : () => new Date().getTime(),
    // currentSliderTimeMin : () => new Date().getTime(),
    valueRange : () => [null,null],
    //valueRange : () => [1284866786842,new Date().getTime()],
    pageTopos :  1,
    valueRangeWeight : () => [1,10],

    // TODO set default to minTime
    selectedNodeCategories: [],
    // viz layout settings
    graphVisible : false, // default to graph view
    geoMapVisible : true,
    hasCharts : true,
    chartsVisible : false,
    legendVisible : false,
    timeLineVisible : false,
    // network/map
    layoutName : 'spread',
    nodeRadius : 'weight',
    geoMapTile : 'default',
    SaveNodeMovesToDB: false,
    // selection
    selectedElements : [],
    focusElement: null,
    cy : null, // cytoscape graph
    // isolate
    isolateMode : false,
    prevPositions : null,
    //styling
    fontSizeNetwork :  8,
  }
})
export class TopogramViewComponentForMapScreenshots extends React.Component {

  static propTypes = {
    ui: PropTypes.object,
    updateUI: PropTypes.func,
    hasTimeInfo: PropTypes.bool,
    hasGeoInfo: PropTypes.bool,
    hasCharts : PropTypes.bool,
    maxTime: PropTypes.instanceOf(Date),
    minTime: PropTypes.instanceOf(Date),
    maxWeight: PropTypes.number,
    minWeight: PropTypes.number,

    nodeCategories: PropTypes.array,
    nodes: PropTypes.array,
    edges: PropTypes.array,
    topogram: PropTypes.object,
    topogramId: PropTypes.string,
    isLoggedIn : PropTypes.bool,
    userId: PropTypes.string,
    loadTopogram : PropTypes.func.isRequired,
    loadNodes : PropTypes.func.isRequired,
    loadEdges : PropTypes.func.isRequired,
    stopNodesSubscription : PropTypes.func.isRequired,
    stopEdgesSubscription : PropTypes.func.isRequired,
    stopTopogramSubscription : PropTypes.func.isRequired,
    router : PropTypes.object.isRequired,
    params : PropTypes.shape({
      topogramId : PropTypes.string.isRequired
    })
  }

  constructor(props) {
    super(props)
    this.toggleTitleBox = this.toggleTitleBox.bind(this)

    // snackbar
    this.state = {
      open: false,
      message: ''
    }
    this.promptSnackbar = this.promptSnackbar.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  componentDidMount() {
    this.props.loadTopogram(this.props.params.topogramId)
    this.props.loadNodes(this.props.params.topogramId)
    this.props.loadEdges(this.props.params.topogramId)
  }

  componentWillUnmount() {
    this.props.stopNodesSubscription()
    this.props.stopEdgesSubscription()
    this.props.stopTopogramSubscription()
  }

  handleToggleSelectionMode = () =>
  this.props.updateUI('filterPanelIsOpen', !this.props.ui.filterPanelIsOpen)

  handleSaveSelection = () =>{
    const {
      cy,
      selectedElements,
      isolateMode,
      prevPositions,
      topogramId,
      //selectedIds,
      //nodeIds,
      //edges
    } = this.props.ui
    if (isolateMode) {
      console.log("prev pos",{...prevPositions})
      console.log("selectedElements",{...selectedElements})
      console.log("cy",{...cy})
      const selectedIds = selectedElements.map(e => e.data.id)
      console.log("selectedIds",selectedIds)
      const focusedNodes = cy.filter((i, e) =>
      selectedIds.includes(e.id())
    )
    console.log(focusedNodes)

    //console.log("nodeId",{...nodeIds}),
    //console.log("edges",{...edges})
    // check imports/client/store/index.js
    //AND https://github.com/rt2zz/redux-persist/issues/99
  }
}


handleLoadSelection = () =>{


}


handleSaveSVGs =() =>{

}











handleEnterIsolateMode = () => {

  const {
    cy,
    selectedElements,
    isolateMode
  } = this.props.ui

  // store previous nodes position
  const prevPositions = {}
  if (!isolateMode) {
    cy.nodes().forEach(n =>
      prevPositions[n.id()] = {...n.position()}
    )
    console.log({...prevPositions})
    this.props.updateUI('prevPositions', {...prevPositions})
  }

  // isolate mode ON
  this.props.updateUI('isolateMode', true)

  // get my nodes/edges
  const selectedIds = selectedElements.map(e => e.data.id)
  const focusedNodes = cy.filter((i, e) =>
  selectedIds.includes(e.id())
)

cy.nodes().style({ 'opacity': '0' });
cy.edges().style({ 'opacity': '0' });

// select
var subGraph = focusedNodes.openNeighborhood();
focusedNodes.style({ 'opacity': '1' });
subGraph.style({ 'opacity': '1'});

// apply focus layout
subGraph.layout({
  'name':"spread",
  'minDist' : 30,
  'padding' : 50
})
}

handleEnterExtractMode = () => {

  const {
    cy,
    selectedElements,
    isolateMode
  } = this.props.ui

  // store previous nodes position
  const prevPositions = {}
  if (!isolateMode) {
    cy.nodes().forEach(n =>
      prevPositions[n.id()] = {...n.position()}
    )
    this.props.updateUI('prevPositions', {...prevPositions})
  }

  // isolate mode ON
  this.props.updateUI('isolateMode', true)

  // get my nodes/edges
  const selectedIds = selectedElements.map(e => e.data.id)
  const focusedNodes = cy.filter((i, e) =>
  selectedIds.includes(e.id())
)

cy.nodes().style({ 'opacity': '0' });
cy.edges().style({ 'opacity': '0' });

// select ,need to catch type error since layout is not redefined, but it is OK for what we want
try {
  var subGraph = focusedNodes.openNeighborhood();
  focusedNodes.style({ 'opacity': '1' });
  subGraph.style({ 'opacity': '1'});

} catch (e) {
  console.log(e instanceof TypeError);
}
// apply focus layout
// subGraph.layout({
//   'name':"spread",
//   'minDist' : 30,
//   'padding' : 50
// })
//this.layout.stop()
//console.log(layout);
}



handleExitIsolateMode = () => {

  const {
    cy,
    prevPositions
  } = this.props.ui

  // isolate mode ON
  this.props.updateUI('isolateMode', false)

  // show all again
  cy.nodes().style({ 'opacity': '1' });
  cy.edges().style({ 'opacity': '1' });

  // bring back positions
  cy.nodes().positions((i,n) => prevPositions[n.id()])
  this.props.updateUI('prevPositions', null)

  cy.fit()
}


onFocusElement = (el) => this.props.updateUI('focusElement', el)
onUnfocusElement = () => this.props.updateUI('focusElement', null)

selectElement = (el) => {

  el.data.selected = true

  const { cy } = this.props.ui
  let filter = `${el.group.slice(0,-1)}[id='${el.data.id}']`
  cy.filter(filter).data('selected', true)

  this.props.updateUI(
    'selectedElements',
    [...this.props.ui.selectedElements, el]
  )

}

unselectElement = (el) => {

  el.data.selected = false

  const { cy, isolateMode } = this.props.ui
  let filter = `${el.group.slice(0,-1)}[id='${el.data.id}']`
  cy.filter(filter).data('selected', false)

  const {selectedElements} = this.props.ui

  const remainingElements = [...
    selectedElements.filter(n =>
      !(
        n.data.id === el.data.id
        &&
        n.group === el.group
      )
    )
  ]

  this.props.updateUI('selectedElements', remainingElements)
  // console.log(remainingElements, isolateMode);

  if(!remainingElements.length && isolateMode)
  this.handleExitIsolateMode()
}

unselectAllElements = () => {
  const { cy, selectedElements } = this.props.ui

  cy.elements().data('selected', false)
  selectedElements.forEach(el=> el.data.selected = false)

  this.props.updateUI('selectedElements', [])

}

toggleTitleBox() {
  const toggled = this.refs.sideNav.state.open ? false : true
  this.refs.sideNav.setState({ open : toggled })
}

promptSnackbar(msg) {
  this.setState({
    open: true,
    message: msg
  })
}

handleRequestClose() {
  this.setState({
    open: false,
  })
}

componentWillUpdate(nextProps) {

  // // show timeline if time info
  // if (this.props.hasTimeInfo)
  //   this.props.updateUI('timeLineVisible', true)

  const {
    ui,
    hasTimeInfo,
    hasCharts,
    nodeCategories,
    minTime,
    maxTime,
    valueRange,
    maxWeight,
    minWeight,
  } = this.props

  if (hasTimeInfo && !ui.minTime && !ui.maxTime) {
    // pass value to UI as default
    this.props.updateUI('minTime', minTime)
    this.props.updateUI('maxTime', maxTime)

  }
  if (hasTimeInfo && ui.valueRange.some(function (el) {
    return el == null;
  }))

  {
    // pass value to UI as default
    this.props.updateUI('valueRange', [Math.round(minTime),Math.round(maxTime)])


  }
  if (nodeCategories && !ui.minWeight && !ui.maxWeight){
    this.props.updateUI('minWeight', minWeight)
    this.props.updateUI('maxWeight', maxWeight)

  }


  // default value to all
  if (nodeCategories && !ui.selectedNodeCategories.length)
  this.props.updateUI('selectedNodeCategories', nodeCategories)

}





render() {

  const {
    hasTimeInfo,
    nodeCategories,
    hasCharts,
    user,
    router,
    timeLineVisible
  } = this.props

  const filterTime = (n) =>
  hasTimeInfo ?
  //new Date(this.props.ui.maxTime) >= new Date(n.data.end)
  //&&
  new Date(this.props.ui.valueRange[0]) < new Date(n.data.end)
  &&
  new Date(n.data.start) >= new Date(this.props.ui.minTime)
  && new Date(this.props.ui.valueRange[1]) >= new Date(n.data.start)
  :
  true
  //console.log("hasCharts",hasCharts);





  const filterCategories = (n) => !!nodeCategories.length ?
  this.props.ui.selectedNodeCategories.includes(n.data.group)
  :
  true

  const selectedIds = this.props.ui.selectedElements.map(d=>d.data.id)
  //console.log("visible",timeLineVisible);
  const nodes =  this.props.nodes.filter(n =>
    //timeLineVisible?

    filterTime(n)&& filterCategories(n)
    // : filterCategories(n)

  )
  .map(n => {
    let selected = selectedIds.includes(n.data.id)
    let node = Object.assign( {}, n)
    node.data.selected = selected
    return node
  })
  //      console.log(nodes);

  const nodeIds = nodes.map(n => n.data.id)

  const edges = this.props.edges

  .filter(e =>


    hasTimeInfo ?
    new Date(e.data.start) >= new Date(this.props.ui.minTime)
    && new Date(this.props.ui.valueRange[1]) >= new Date(e.data.start)
    && new Date(this.props.ui.valueRange[0]) < new Date(e.data.end)

    && nodeIds.includes(e.data.source) && nodeIds.includes(e.data.target)
    :
    nodeIds.includes(e.data.source) && nodeIds.includes(e.data.target)

  )

  // console.log(this.props.userId, this.props.topogram.userId, this.props.isLoggedIn);
  // console.log(this.props.userId === this.props.topogram.userId && this.props.isLoggedIn);

  return (
    <div>


      <MainViz
        topogramId={ this.props.params.topogramId }
        nodes={ nodes }
        edges={ edges }
        onFocusElement={this.onFocusElement}
        onUnfocusElement={this.onUnfocusElement}
        onClickElement={this.onClickElement}
        selectElement={this.selectElement}
        unselectElement={this.unselectElement}
        unselectAllElements={this.unselectAllElements}
        hasTimeInfo={ this.props.hasTimeInfo }
        hasCharts={ this.props.hasCharts }
        hasGeoInfo={ this.props.hasGeoInfo }
        fontSizeNetwork={this.props.ui.fontSizeNetwork}
        SaveNodeMovesToDB={this.props.ui.SaveNodeMovesToDB}
        />




    </div>
  )
}
}

import { connect } from 'react-redux'
import { stopSubscription } from 'meteor-redux-middlewares'

import { loadNodes, NODES_SUB } from '/imports/client/actions/nodes'
import { loadEdges, EDGES_SUB } from '/imports/client/actions/edges'
import { loadTopogram, TOPOGRAM_SINGLE_SUB } from '/imports/client/actions/topogram'

import { TopogramViewComponentForMapScreenshotsNoTilesWithMainVenuesHighlighted } from '/imports/client/ui/pages/TopogramViewComponentForMapScreenshotsNoTilesWithMainVenuesHighlighted.jsx'

const mapStateToProps = state => ({
  nodesReady: state.nodes.ready,
  nodes: state.nodes.nodes,
  hasTimeInfo : state.nodes.hasTimeInfo,
  hasGeoInfo : state.nodes.hasGeoInfo,
  minTime : state.nodes.minTime,
  maxTime : state.nodes.maxTime,
  minWeight : state.nodes.minWeight,
  maxWeight : state.nodes.maxWeight,
  pageTopos : state.pageTopos,


  nodeCategories : state.nodes.nodeCategories,
  edgesReady: state.edges.ready,
  edges: state.edges.edges,
  topogram : state.topogram.topogram,
  topogramReady : state.topogram.ready,
  userId : state.user._id,
  isLoggedIn : state.user.isLoggedIn,
  hasCharts : state.nodes.hasCharts
})

const mapDispatchToProps = dispatch => ({
  loadTopogram: (topogramId) => dispatch(loadTopogram(topogramId)),
  loadNodes: (topogramId) => dispatch(loadNodes(topogramId)),
  loadEdges: (topogramId) => dispatch(loadEdges(topogramId)),
  stopNodesSubscription: () => dispatch(stopSubscription(NODES_SUB)),
  stopEdgesSubscription: () => dispatch(stopSubscription(EDGES_SUB)),
  stopTopogramSubscription: () => dispatch(stopSubscription(TOPOGRAM_SINGLE_SUB)),
})

export const TopogramViewContainerForMapScreenshotsNoTilesWithMainVenuesHighlighted = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopogramViewComponentForMapScreenshotsNoTilesWithMainVenuesHighlighted)

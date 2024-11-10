import React, { PropTypes } from 'react'
import Toggle from 'material-ui/Toggle'
import SubHeader from 'material-ui/Subheader'
import { GridList } from 'material-ui/GridList'
import TopogramListItem from './TopogramListItem.jsx'
import ui from 'redux-ui'
import { defineMessages, injectIntl } from 'react-intl'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import './TopogramList.css'
const messages = defineMessages({
  hint : {
    'id': 'queryBox.hint',
    'defaultMessage': 'Search for a Map',
    'message': ''
  },
  label : {
    'id': 'queryBox.label',
    'defaultMessage': 'Map search',
    'message': ''
  }
})

@ui()
class TopogramList extends React.Component {

  constructor(props) {
    super(props)
    this.state = { anonymousOnly : false ,
      currentValue : null,
      pageTopos : 1,
      order : null,
      direction : true,

    }
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    showFilters : PropTypes.bool.isRequired,
    topograms: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,


  }

  handleOnToggle = () => {
    this.setState({ anonymousOnly : !this.state.anonymousOnly })
  }




  handlePageTopoUp = (pageTopos,numbTopopages) => {

    if (this.state.pageTopos < numbTopopages) {
      var valuepageTopos=this.state.pageTopos
      valuepageTopos+=1

      this.setState({
        pageTopos :valuepageTopos
      })

    }}

    handlePageTopoDown = (pageTopos,numbTopopages) => {
      if (pageTopos > 1) {
        var valuepageTopos=this.state.pageTopos
        valuepageTopos-=1
        this.setState({
          pageTopos :valuepageTopos
        })
      }}



      handleNewRequest = ({value, text, topogram}, index) => {
        //const {selectElement} = this.props
        //console.log("VALUE",value)
        //console.log("TEXT",text)
        //console.log("topogram",topogram)

        const {win} = window.open(`/topograms/${topogram._id}`, '_blank');



      }




      render() {

        const { formatMessage } = this.props.intl
        const { pageTopos } = this.props.ui

        //this.props.updateUI({pageTopos:1})
        const { anonymousOnly } = this.state
        const { showFilters, title, topograms } = this.props

        const dataSource = topograms
        .filter(d => anonymousOnly ? d.userId === null : true)
        .sort( (a, b) => b.createdAt - a.createdAt)
        .map( n => (
          {
            value : n.title.substr(0, 20),
            text : n.title.substr(0, 20),
            topogram : n
          }
        ))
        //console.log("dataSource",dataSource);

        const topogramItems = topograms
        .filter(d => anonymousOnly ? d.userId === null : true)
        .sort( (a, b) => b.createdAt - a.createdAt)
        .map( topogram => (
          <TopogramListItem
            key={ topogram._id }
            topogramId={ topogram._id }
            topogramTitle={ topogram.title.split(/\SBETA.*/gm).slice(0)[0] }
            topogramDesc={ topogram.title.split(/\SBETA.*/gm).slice(1)[0] }
            //topogramDesc={topogram.title.split(/Distance totale parcourue par l'artiste: /gm).slice(1)[0].split(/km/gm).match() }
            topogramVersion={ topogram.title.match(/BETA..../gm).slice(0)[0] }

            author={topogram.author &&  topogram.author.username ? topogram.author.username : null}
            topogramSharedPublic={topogram.sharedPublic}
            router={this.props.router}
            lastModified={ topogram.createdAt }
            />

        ))

        const   numbTopopages = Math.ceil(topogramItems.length/128)
        export { numbTopopages}

        return (
          <div style={{backgroundColor:'#D6EBE6',color: '#000  !important'}}>
            <AutoComplete
              ref="queryBox"
              filter={AutoComplete.fuzzyFilter}
              dataSource={dataSource}
              maxSearchResults={70}
              // fullWidth={true}
              menuProps={{desktop:true}}
               floatingLabelStyle= {{
                 color: '#fff !important',
               }}

               underlineStyle={{
                 display:"none",


               }}



              hintText={formatMessage(messages.hint)}
              floatingLabelText={formatMessage(messages.label)}
              onNewRequest={this.handleNewRequest}
              // onUpdateInput={this.handleUpdateInput}

              />

            <section
              className="home-public-list"
              style={{ width : '80vw', margin : '0 auto 1em auto' }}
              >
              <SubHeader>{title}</SubHeader>
              {
                showFilters ?
                <div style={{ maxWidth: 250, paddingBottom : '1em' }}>
                  <Toggle
                    label="Show only anonymous"
                    toggled={anonymousOnly}
                    onToggle={this.handleOnToggle}
                    />
                </div>
                :
                null
              }
              {
                topogramItems.length > 128 ?

                <div>
                  <GridList
                    cellHeight={240}
                    cols={3}
                    >
                    {topogramItems.slice(0+128*this.state.pageTopos,128+128*this.state.pageTopos)}
                  </GridList>
                  <RaisedButton
                    style={{backgroundColor: "#aa8dc6 !important"}}
                    label="previous"
                    primary={true}
                    onClick={() => this.handlePageTopoDown(numbTopopages)}
                    />
                  <RaisedButton
                    label="next"
                    primary={true}
                    onClick={() => this.handlePageTopoUp({pageTopos},numbTopopages)}
                    />
                  <p>{this.state.pageTopos}/{numbTopopages} </p>
                </div>
                :
                topogramItems.length ?
                <GridList
                  cellHeight={240}
                  cols={3}
                  >
                  {topogramItems}
                </GridList>
                :
                <p>No topograms yet!</p>
              }
            </section>
          </div>
        )
      }
    }

    TopogramList.propTypes = {
      // promptSnackbar: PropTypes.func,
      topogram : PropTypes.object,
      //nodes : PropTypes.array,
      // edges : PropTypes.array,
      // style : PropTypes.object,
      // intl : PropTypes.shape({
      //   formatMessage : PropTypes.func
      // })
    }

    TopogramList.defaultProps = {
      topogram : {},
      nodes : [],
      edges : [],
      //pageTopos: 1
    }

    export default injectIntl(TopogramList)

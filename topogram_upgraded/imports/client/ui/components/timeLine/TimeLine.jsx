import React, { PropTypes } from 'react'
import ui from 'redux-ui'
import moment from 'moment'

import { Card, CardText, CardHeader } from 'material-ui/Card'
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker'
import IconButton from 'material-ui/IconButton'
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import Pause from 'material-ui/svg-icons/av/pause';
import Stop from 'material-ui/svg-icons/av/stop';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import TimeSlider from './TimeSlider.jsx'

const styleTimeLine = {
  //height: '100px',
  position: 'fixed',
  bottom: 0,
  width: '70vw',
  fontSize: '8pt',
  display: 'inline-block',
  boxShadow: '1px 1px 8px  #000',
  border: '1px solid #222',
  backgroundColor: 'rgba(69,90,100 ,0.7)',
  //margin: '20px 2px',

  //align: 'left',
  //marginBottom: '10px',
  borderTopRightRadius: '20px',
  borderBottomRightRadius: '5px',
  padding:"2px 2px 15px 15px ",
  transitionEnabled: "true",
  //paddingBottom:"15px"

}

@ui()
export default class TimeLine extends React.Component {

  constructor(props) {
    super(props)

    var seconds = parseInt((this.props.ui.maxTime-this.props.ui.minTime)/1000);
    //console.log("seconds",seconds)
    var tempo = Math.floor(seconds);
    // var valueRange=[Math.round(this.props.ui.minTime),Math.round(this.props.ui.minTime)+10*tempo]
    console.log(tempo,"tempo");
    this.originalTempo = tempo

    this.state = {
      playing : false,
      tempo,
      step : 1,
      timer : null,
      stopPressedOnce:true,
      // valueRange : [Math.round(this.props.ui.minTime),Math.round(this.props.ui.minTime)+10*tempo]
    }
  }

  static propTypes = {
    hasTimeInfo : PropTypes.bool
  }

  handleChangeMinTime = (event, date) => {
    this.props.updateUI('minTime', date)
  }

  handleChangeMaxTime = (event, date) => {
    this.props.updateUI('maxTime', date)
  }

  openMinDatePicker = () => {
    this.refs.minDatePicker.focus()
  }

  openMaxDatePicker = () => {
    this.refs.maxDatePicker.focus()
  }

  pause = () => {
    // clearInterval
    clearInterval(this.state.timer)
    this.setState({playing : false, timer : null})
  }

  play = () => {
    var seconds = parseInt((this.props.ui.maxTime-this.props.ui.minTime)/1000);
    console.log("seconds",seconds)
    var tempo = Math.floor(seconds);


    this.originalTempo = tempo


    const { maxTime } = this.props.ui


    // start setInterval
    const timer = setInterval( () => {
      const newTime = Math.round(this.props.ui.valueRange[1]) + tempo;
      //console.log("newtime",newTime);
      if (newTime >= Math.round(maxTime)) this.pause()
      var newValue = [this.props.ui.valueRange[0],newTime]
      this.props.updateUI({
        valueRange: newValue
      })
    },10)

    this.setState({
      playing : true,
      timer
    })
  }

  next=()=>{
    var newValue =0
// if (this.props.ui.valueRange[0]==this.props.ui.minTime &&this.props.ui.valueRange[1]==this.props.ui.maxTime ) {
//   newValue = [
//     this.props.ui.minTime,moment(this.props.ui.minTime).add(1,'years').unix()]
//
// } else {
//

    newValue = [
      moment(this.props.ui.valueRange[0]).add(1,'years').unix()*1000,moment(this.props.ui.valueRange[1]).add(1,'years').unix()*1000]

      if (newValue[1]>this.props.ui.maxTime) {
        newValue[1]=this.props.ui.maxTime
      }
      if (newValue[0]>=this.props.ui.maxTime) {
        newValue[0]=moment(this.props.ui.maxTime).add(-1,'years').unix()*1000
      }
    // }

      this.props.updateUI({


        valueRange: newValue

      })

    }


    stop = () => {
      this.pause()


      //console.log( [Math.round(this.props.ui.minTime),Math.round(this.props.ui.maxTime)]);
      var newValueStop =0
      //console.log(this );
      if (this.state.stopPressedOnce) {
        var seconds = parseInt((this.props.ui.maxTime-this.props.ui.minTime)/1000);
        // console.log("seconds",seconds)
        var tempo = Math.floor(seconds);
        var temp=(moment(this.props.ui.minTime))
        var temp2=temp
        temp2.add(1,'years')
        // console.log(new Date(this.props.ui.minTime).add(tempo,'seconds'))
        // console.log("temostop",typeof(Math.round(this.props.ui.minTime)));
        // console.log(tempo);
        //        console.log(temp.format());
        //        console.log(temp2.format());
        //        console.log(temp2.unix());
        newValueStop = [Math.round(this.props.ui.minTime),temp2.unix()*1000]
        // console.log(newValueStop);
      }
      else {
        newValueStop = [Math.round(this.props.ui.minTime),Math.round(this.props.ui.maxTime)]
        // console.log(newValueStop);
      }

      this.props.updateUI({


        valueRange: newValueStop

      })



      // console.log(this.state.stopPressedOnce);
      // console.log(!this.state.stopPressedOnce);

      this.setState({stopPressedOnce : !this.state.stopPressedOnce})
    }

    handleChangeStep = (e) => {

      const step = e.target.value
      const tempo = this.originalTempo*step
      this.setState({ step, tempo })
    }
    render() {

      const { minTime, maxTime } = this.props.ui
      const { hasTimeInfo } = this.props


      return (
        <Card
          style={styleTimeLine}
          >
          { !hasTimeInfo ?
            <CardHeader
              title={'No time info available.'}
              />
            :
            <div>

              <table>
                <tbody>

                  <tr>
                    <td style={{width: "30%",marginBottom: '0em',
                      marginTop: '0em',whiteSpace: 'nowrap'}}>
                      <div style={{height: '0.5em',marginBottom: '0em',
                        marginTop: '0em'}}>
                        <span  style={{marginBottom: '0em',
                          marginTop: '0em'}}>
                          From <a onClick={this.openMinDatePicker}
                          style={{ cursor : 'pointer', color : 'black' }}>
                          {`${moment(minTime).format('MMM Do YYYY')}`}
                        </a> to <a onClick={this.openMaxDatePicker}
                        style={{ cursor : 'pointer', color : 'black' }}>
                        {`${moment(maxTime).format('MMM Do YYYY')}`}
                      </a>

                    </span>
                    <IconButton
                      size="small"
                      onClick={
                        this.state.playing ?
                        () => this.pause()
                        :
                        () => this.play()
                      }
                      alt="Play/Resume"
                      title="Play/Resume"

                      >
                      {
                        this.state.playing ?
                        <Pause />
                        :
                        <PlayCircleFilled />
                      }
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => this.next()}
                      alt="next year of tours"
                      title="next year of tours"
                      >
                      <SkipNext />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => this.stop()}
                      alt="Stop/1st year of tour"
                      title="Stop/1st year of tour"
                      >
                      <Stop />
                    </IconButton>

                    <TextField
                      className= 'textFTime'
                      name='stepSetter'
                      type='number'
                      min={0.1}
                      max={10}
                      step={.1}
                      floatingLabelFixed={true}
                      floatingLabelText='Speed'
                      floatingLabelStyle={{color: 'black'}}
                      style={{width : '3em', margin: '0 2em',fontSize: "10pt"}}
                      value={this.state.step}

                      // columns={3}

                      onChange={this.handleChangeStep}
                      />

                  </div>
                </td>
                <td style={{width: "7%"}}>

                </td>
                <td style={{width: "60%", align:"right"}}>

                  <div>
                    <span>
                      <DatePicker
                        onChange={this.handleChangeMinTime}
                        ref="minDatePicker"
                        autoOk={true}
                        textFieldStyle={{ display: 'none' }}
                        floatingLabelText="Min Date"
                        value={minTime}
                        />
                      <DatePicker
                        ref="maxDatePicker"
                        textFieldStyle={{ display: 'none' }}
                        onChange={this.handleChangeMaxTime}
                        autoOk={true}
                        floatingLabelText="Max Date"
                        value={maxTime}
                        />
                      <CardText>
                        { minTime && maxTime ?
                          <TimeSlider
                            minTime={new Date(minTime).getTime()}
                            maxTime={new Date(maxTime).getTime()}
                            />
                          :
                          null
                        }
                      </CardText>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>

          </table>

        </div>
      }
    </Card>
  )
}
}

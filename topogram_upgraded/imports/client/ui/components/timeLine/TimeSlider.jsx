
import './timeline.css'

import React, { PropTypes } from 'react'
import ui from 'redux-ui'
import moment from 'moment'
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';


import './indexRCSLIDER.css';


const createSliderWithTooltip =   Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

//const SliderWithTooltip = createSliderWithTooltip(Slider)

function dateFormatter(v) {
  return moment(v).format('MMM D, YYYY')
}

@ui()
export default class TimeSlider extends React.Component {

  static propTypes = {
    minTime : PropTypes.number,
    maxTime : PropTypes.number
  }

  onSliderChange = (value) => {
    this.props.updateUI({ //currentSliderTime : value[1],
      //currentSliderTimeMin : value[0],
      valueRange : value

     })
     console.log(this.props.ui.valueRange)
     //console.log(value[1],value[0])

  }



  render() {
    const { minTime, maxTime
     } = this.props
    const { valueRange

   } = this.props.ui

    const minYear = moment(minTime).year(),
      maxYear = moment(maxTime).year()

    // generate list of years (in ms)
    const marksYears = {}
    Array(maxYear-minYear+1)
      .fill(0)
      .map((n,i) => minYear+i)
      .forEach(n => marksYears[new Date(n, 0, 1).getTime()] = n)

      //let valueRange = [{currentSliderTimeMin},{currentSliderTime}]


    return (
      <div>

          <div>

            <Range
            defaultValue={[minTime,maxTime]}
            style={{ zIndex : 1000 }}
            value={valueRange}
            min={minTime}
            max={maxTime}
            //defaultValue={[ 1281214800000, 1284866786842 ]}
            step={1}
            marks={marksYears}
            marksStyle={{ zIndex : 10 }}
            tipFormatter={dateFormatter}
            tipProps={{ overlayClassName: 'foo' }}
            //onAfterChange={this.onSliderChange}
            onChange={this.onSliderChange}
            pushable={true}
            allowCross={true}
            />
          </div>
        </div>


    )
  }
}

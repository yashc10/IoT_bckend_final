import React,  {Component} from 'react';
import { Bar,Line,Pie } from 'react-chartjs-2';  

// class Form extends Component{
//     constructor(props){
//         super(props)
//         this.state={
//                     sensorId: '',
//                     frequency: '3'
//         }
//     }
// handlesensorIdchange= event =>
// {
// this.setState(
//     {
//         sensorId:event.target.value
//     }
// )
// }
// handleFrequencyChange= event =>
// {
//     this.setState(
//         {
//             frequency:event.target.value
//         }
//     )
// }
// handleSubmit = event =>{
//     this.setState({
//         sensorId: event.target.value,

//     })
// }
// // <div id='layout'>
//             //     <div className='clientInput'></div>
//     render(){   
//         return(     
//             // </div>
//             <form onSubmit={this.handleSubmit}>
//                 <div>
//                     <label>Senor ID</label>
//                     <input type="text" value={this.state.sensorId} onChange={this.handlesensorIdchange}/>
//                 </div>
//                 <div>
//                     <label>
//                         Frequency of data
//                     </label>
//                     <select value={this.state.frequency} onChange={this.handleFrequencyChange}>
//                         <option value ="yearly">Yearly</option>
//                         <option value ="monthly">Monthly</option>
//                         <option value ="daily">Daily</option>
//                         <option value ="hourly">Hourly</option>
 
//                     </select>
//                 </div>
//                 <button type="submit">Submit</button>
//             </form>
            
            
//         )
//     }
// }






class Chart extends Component{
    constructor(props){
        super(props);             //to intialise the parent constructor. Refer react documentation.
        this.state={
            chartData:props.chartData                           
        
    }}
static defaultProps ={
    displayTile:true,                    
    displayLegend:true,
    legendPosition:'right',
    location:'temperature'                            //the location must be made customisable.

}    
    render(){
        return(
            

            <div>
            
                 <Bar
                    data={this.state.chartData}
                    
                    options={{

                        title:{
                            display:this.props.displayTitle,
                    
                            text:this.props.location + ' data across time',          //notice there is no hardcoding, but the parameter must be passable by the client
                            fontSize:25
                        },
                        legend:{
                            display:this.props.displayLegend,
                            position:this.props.legendPosition
                        }

                    }}
                />


                    <Line
                    data={this.state.chartData}
                    
                    options={{

                        title:{
                            display:this.props.displayTitle,
                    
                            text:this.props.location + ' data across time',     //notice there is no hardcoding, but the parameter must be passable by the client
                            fontSize:25
                        },
                        legend:{
                            display:this.props.displayLegend,
                            position:this.props.legendPosition
                        }

                    }}
                />



                <Pie
                    data={this.state.chartData}
                    
                    options={{

                        title:{
                            display:this.props.displayTitle,
                    
                            text:this.props.location + ' data across time',
                            fontSize:25
                        },
                        legend:{
                            display:this.props.displayLegend,
                            position:this.props.legendPosition
                        }

                    }}
                />
             </div>
        )
    }
}

export default Chart;

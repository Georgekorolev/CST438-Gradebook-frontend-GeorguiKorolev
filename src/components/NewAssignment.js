import React, { Component } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SERVER_URL} from '../constants.js';
import { Link } from 'react-router-dom';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


class NewAssignment extends Component {
    constructor(props) {
      super(props);
      this.state = {name:"", dueDate:"", courseId: 0 , selectedDate: null};
    };

    handleChange = (event) => {
    this.setState({[event.target.name]:event.target.value});
    }

    convertDateToString = (date) => {
      const day = date.get("date");
      const month = date.get("month") + 1;
      let dayString = day < 10 ? "0" + day : day;
      let monthString = month < 10 ? "0" + month : month;
      return  date.get("year") + "-" + monthString + "-" + dayString;
    }


  // Add the assignment and close the dialog
    handleSubmit = () => {
      
       const assignment = {name: this.state.name, 
                          dueDate: this.convertDateToString(this.state.selectedDate), 
                          courseId: this.state.courseId}
                          
        fetch(`${SERVER_URL}/addAssignment`, 
          {  
            method: 'PUT', 
            headers: 
            { 
              'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(assignment)
          } )
        .then(res => {
            if (res.ok) {
              toast.success("Assignment successfully added", {
                  position: toast.POSITION.TOP_CENTER
              });
            } else {
              toast.error("Error new assignment failed.", {
                  position: toast.POSITION.TOP_CENTER
              });
              console.error('Post http status =' + res.status);
            }})
        .catch(err => {
          toast.error("Error new assignment failed.", {
                position: toast.POSITION.TOP_CENTER
            });
            console.error(err);
        })
    }

    handleDateChange(date) {
      this.setState({ selectedDate: date });
    }

    render()  { 
        return(
            <div className="App">
              <div style={{padding: 10}}>
                <TextField autoFocus label="Course Id" name="courseId" 
                         onChange={this.handleChange}  />
                <br/><br/>
                <TextField label="Assignment name" name="name"
                          onChange={this.handleChange}  />
                <br/><br/>
                <LocalizationProvider dateAdapter={AdapterDayjs} style={{margin: 10}}>
                  <DatePicker value={this.state.selectedDate} onChange={(date) => this.handleDateChange(date)} 
                  format="YYYY-MM-DD" views={["year", "month", "day"]}/>
                </LocalizationProvider>
                
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <Button id="Submit" variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleSubmit} >
                   Submit
                </Button>
                <Button component={Link} to={{pathname:'/'}} id="Back" variant="outlined" color="primary" style={{margin: 10}} >
                   Back
                </Button>
              </div>
              <ToastContainer autoClose={1500} />   
            </div>
            ); 
    }
}


export default NewAssignment;

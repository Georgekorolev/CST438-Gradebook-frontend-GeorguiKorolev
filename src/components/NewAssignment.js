import React, { Component } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SERVER_URL} from '../constants.js';
import { Link } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormControl } from '@mui/material';


class NewAssignment extends Component {
    constructor(props) {
      super(props);
      this.state = {name:"", dueDate:"", selectedDate: null, courses: [], selectedCourse: -1};
      this.handleCourseChange = this.handleCourseChange.bind(this);
    };

    componentDidMount() {
      this.fetchCourses();
    }

    fetchCourses = () => {
      console.log("NewAssignment.fetchCourses");
      const token = Cookies.get('XSRF-TOKEN');
      fetch(`${SERVER_URL}/courses`, 
        {  
          method: 'GET', 
          headers: { 'X-XSRF-TOKEN': token }
        } )
      .then((response) => response.json()) 
      .then((responseData) => { 
        if (Array.isArray(responseData.courses)) {
          //  add to each course an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
          this.setState({ courses: responseData.courses.map((course, index) => ( { id: index, ...course } )) });
          responseData.courses.forEach(course => {
            console.log(course);
          });
          
        } else {
          toast.error("Fetch failed.", {
            position: toast.POSITION.BOTTOM_LEFT
          });
        }        
      })
      .catch(err => console.error(err)); 
    }

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


    // Add the assignment
    handleSubmit = () => {
        
      if(this.state.selectedCourse === -1){
        toast.error("A course MUST be selected.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }

      if(this.state.name === ""){
        toast.error("Assignment name cannot be empty.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }

      if(this.state.selectedDate === null){
        toast.error("A due date MUST be selected.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      
       const assignment = {name: this.state.name, 
                          dueDate: this.convertDateToString(this.state.selectedDate), 
                          courseId: this.state.selectedCourse}
                          
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

    handleCourseChange(event) {
      console.log(event.target)
      this.setState({ selectedCourse: event.target.value });
    }

    render()  { 
        return(
            <div className="App">
              <div style={{padding: 10}}>
                <FormControl>
                <InputLabel shrink={false} id="select-label">
                  Select a course
                </InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  value={this.state.selectedCourse}
                  onChange={this.handleCourseChange}
                  displayEmpty
                >
                  {this.state.courses.map((course) => (
                    <MenuItem key={course.title} value={course.courseId}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
                <br/><br/>
                <TextField label="Assignment name" name="name"
                          onChange={this.handleChange}  />
                <br/><br/>
                <LocalizationProvider dateAdapter={AdapterDayjs} style={{margin: 10}}>
                  <DatePicker value={this.state.selectedDate} onChange={(date) => this.handleDateChange(date)} 
                  label="Select a due date"/>
                </LocalizationProvider>
                </FormControl>
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

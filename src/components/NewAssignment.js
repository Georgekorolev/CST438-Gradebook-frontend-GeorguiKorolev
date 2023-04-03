import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import {SERVER_URL} from '../constants.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class NewAssignment extends React.Component {
  constructor(props) {
    super(props);
  };
  
  render() {
    return(
         <div className="App">
           <Grid container>
             <Grid item align="left">
                <h4>Assignment: </h4>
                <h4>Course: </h4>                   
             </Grid>
           </Grid>
           <div style={{width:'100%'}}>
             For DEBUG:  display state.
             {JSON.stringify(this.state)}
           </div>
           <div style={{ height: 400, width: '100%' }}>
              <Button component={Link} to={{pathname:'/'}} id="Back" variant="outlined" color="primary" style={{margin: 10}} >
               Back
              </Button>
              <Button id="Submit" variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleSubmit} >
               Submit
              </Button>
           </div> 
         </div>
    ); 
  };
}  

export default NewAssignment;
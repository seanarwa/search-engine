import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SearchBar from 'material-ui-search-bar';
import { List, ListItem } from '@material-ui/core';
import ListingItem from './ListingItem';
import axios from "axios";

class App extends Component {

  DOCUMENT_URL = "https://dry-dawn-46731.herokuapp.com/";

  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    query: "",
    listings: []
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    // fetch("http://localhost:3001/api/data/get")
    //   .then(data => data.json())
    //   .then(res => this.setState({ data: res.data }))
    //   .catch((err) => console.log(err));
  };

  fetchDocument = (id) => {
    fetch(this.DOCUMENT_URL + "api/document/" + id)
      .then(data => data.json())
      .then(res => console.log(res.data))
      .catch((err) => console.log(err));
  }

  search = (query) => {
    this.setState({
      listings: []
    })
    fetch("https://shielded-ocean-93306.herokuapp.com/api/index/search/" + encodeURI(query))
      .then(data => data.json())
      .then(res => {
        this.setState({
          listings: res.data
        })
      })
      .catch((err) => console.log(err));
  }

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/data/put", {
      id: idToBeAdded,
      message: message
    });
  };


  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/data/delete", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/data/update", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const listings = this.state.listings.map(docId =>
      <ListItem>
        <ListingItem docId={docId} query={this.state.query} style={{margin: 50}}/>
      </ListItem>
    );

    return (
      <MuiThemeProvider>
        <div style={{ height: "20%", width: "100%", display: "flex", justifyContent: 'center', alignItems: "center", flexDirection: "column"}}>
          <SearchBar
            onChange={(query) => {
              this.setState({
                query: query,
                listings: []
              });
            }}
            onRequestSearch={() => this.search(this.state.query)}
            style={{ width: "80%", marginTop: 50 }}
          />
          <List>
            {listings}
          </List>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

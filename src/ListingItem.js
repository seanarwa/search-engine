import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, ButtonBase, Typography } from '@material-ui/core';
import { parse } from 'node-html-parser';

const styles = {
  card: {
    margin: 5,
    display: "flex",
    alignItems: "flex-start"
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 20,
    color: "#1E90FF"
  },
  url: {
    marginBottom: 12,
    color: "#32CD32"
  },
};

class ListingItem extends Component {

  state = {
    document: {},
    title: '',
    phrases: [],
    isLoading: true
  }

  fetchWebPage = (URL) => {
    fetch("https://cors-anywhere.herokuapp.com/" + URL, {
      method: 'GET',
      headers: new Headers({
        'Access-Control-Allow-Origin': '*'
      })
    })
    .then(res => res.text())
    .then(data => {
      const root = parse(data);
      var title = URL;
      if(root.querySelector('title') !== null) title = root.querySelector('title').text;
      // const content = root.rawText.split(' ');
      // var phrases = []
      // this.props.query.split(' ').forEach(token => {
      //   var index = content.indexOf(token);
      //   while(index !== -1) {
      //     try {
      //       phrases.push(content.slice(index - 10, index + 10).join(' '));
      //       if(index + token.size() > content.length)
      //         index = content.indexOf(token, index + token.size());
      //     } catch (err) { }
      //   }
      // });
      this.setState({
        title: title,
        // phrases: phrases,
        isLoading: false
      });
    })
    .catch(err => console.log(err));
  }

  fetchDocument = (id) => {
    fetch("https://cors-anywhere.herokuapp.com/https://dry-dawn-46731.herokuapp.com/api/document/" + id)
      .then(data => data.json())
      .then(res => {
        this.setState({
          document: res.data,
          URL: "http://" + res.data.URL
        });
        this.fetchWebPage(this.state.URL);
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.fetchDocument(this.props.docId);
  }

  render() {

    const phrases = this.state.phrases.map(phrase =>
      <div>
        {phrase}
        <br />
      </div>
    );

    return (
      <Card className={this.props.classes.card}>
        <ButtonBase
            className={this.props.classes.cardAction}
            onClick={event => window.open(this.state.URL, "_blank")}>
          <CardContent>
            <Typography className={this.props.classes.title} color="textSecondary" gutterBottom>
              {this.state.title}
            </Typography>
            <Typography variant="h5" component="h2">

            </Typography>
            <Typography className={this.props.classes.url} color="textSecondary">
              {this.state.URL}
            </Typography>
            <Typography component="p">
              {phrases}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Card>
    );
  }
}

ListingItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListingItem);

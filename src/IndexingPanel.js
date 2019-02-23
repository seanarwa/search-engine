import React, { Component } from "react";


/*
  Computations
  TF(t) = (Number of times term t appears in a document) / (Total number of terms in the document).
  IDF(t) = log_e(Total number of documents / Number of documents with term t in it).
  TFIDF(t) = TF(t) * IDF(t)
*/

class Computation {
  static TFIDF(TF, IDF) {
    return (TF * IDF);
  }

  static TF(termOccurances, totalTerms) {
    return (termOccurances / totalTerms);
  }

  static IDF(documentsWithTerm, totalDocuments) {
    return Math.log(totalDocuments / documentsWithTerm);
  }
}

class IndexingPanel extends Component {
  // initialize our state
  state = {
    documentsValid: 0,
    documentsInvalid: 0,
    totalDocuments: -1,
    isRunning: false
  };

  reader = new FileReader();
  parser = new DOMParser();

  componentDidMount() {
    this.reader.onLoad = function(e) {
      console.log(e.target.result);
    }
  }

  processBookKeeping() {

  }

  startIndexing() {
    this.setState({
      documentsValid: 0,
      documentsInvalid: 0,
      totalDocuments: 0,
      isRunning: true
    });



    (async () => {
        if(!this.state.isRunning) return;

        var filePath = "../WEBPAGES_RAW/0"
        this.reader.readAsText(filePath.files[0]);

    })();
  }

  stopIndexing() {
    this.setState({
      isRunning: false
    })
  }

  render() {
    const { data } = this.state;
    return (
      <div style={{ height: "100vh", width: "100%", display: "flex", justifyContent: 'center', alignItems: "center" }}>
      <button onClick={() => this.startIndexing()}>
        Start Indexing
      </button>
      </div>
    );
  }
}

export default IndexingPanel;

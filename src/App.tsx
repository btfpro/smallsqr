import axios from 'axios';
import * as React from 'react';
import FileDownload from 'react-file-download';
import './App.css';
import FileUploader from './components/FileUploader';

// import logo from './logo.svg';

class App extends React.Component {
  // public fileUploadSuccess(event: any) {
  //   if (event) {
  //     return "";
  //   }
  // }

// <div> <button className="btn btn-success btn-lg" id="downloadBtn"
// onClick={this.downloadHandler}>Download</button>
// < /div>
  public downloadHandler() {
    const fileName: string = '1.sqr';
    axios.get('/v1/ab7820028322/uploads/'+fileName).then((response) => {
      FileDownload(response.data, 'output.txt');
    });
  }
  public render() {
    return (
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="panel panel-default">
                <div className="panel-body">
                  <span className="glyphicon glyphicon-cloud-upload" />
                  <h2>File Uploader</h2>
                  <h4>SQR Files</h4>
                  <FileUploader />
                  <br/>
                  <br/>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App;

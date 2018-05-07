import axios from 'axios';
import * as React from 'react';
import FileDownload from 'react-file-download';
import './App.css';
import FileUploader from './components/FileUploader';

// import logo from './logo.svg';

class App extends React.Component <{}, {sol1Path: string}>{
  constructor(props: any){
    super(props);
    this.state = {
      sol1Path : ''
    }
  }

  public onSol1Path = (val: string) => {
    this.setState({
      sol1Path : val
    });
  }

  public downloadHandler = () => {
    axios.get(this.state.sol1Path).then((response) => {
      FileDownload(response.data, 'output.txt');
    });
  }
  // public fileUploadSuccess(event: any) {
  //   if (event) {
  //     return "";
  //   }
  // }


 
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
                  <FileUploader onSol1Path={this.onSol1Path}/>
                  <br/>
                  <br/>
                  <div> <button className="btn btn-success btn-lg" id="downloadBtn"
                    onClick={this.downloadHandler}
                  disabled={!this.state.sol1Path}>Sol1 Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App;

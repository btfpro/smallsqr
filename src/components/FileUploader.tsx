// tslint:disable-next-line:no-reference / <reference path="../interface.d.ts"
// /> import axios from 'axios';
import * as React from 'react';
import {DropzoneComponent} from 'react-dropzone-component';
import {RingLoader} from 'react-spinners';
// import FileDownload from 'react-file-download';

class FileUploader extends React.Component < IFileUploaderProps,
any > {
    public success : any;
    public callback : any;
    public componentConfig : any;
    public callbackArray : any;
    public dropzone : any;
    public removedfile : any;
    public djsConfig : any;
    public solution1Path : string;
    public options : any;
    constructor(props : IFileUploaderProps) {
        super(props);
        this.state = {
            loading: false,
            value: ''
        }
        // For a full list of possible configurations, please consult
        // http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            timeout: 660000
        };

        this.componentConfig = {
            iconFiletypes: [
                '.sqr', '.zip'
            ],
            postUrl: '/upload?base=' + this.props.sqrInputValue,
            showFiletypeIcon: true
        };


        // If you want to attach multiple callbacks, simply create an array filled with
        // all your callbacks. tslint:disable-next-line:no-console
        this.callbackArray = [
        ];

        // Simple callbacks work too, of course tslint:disable-next-line:no-console
        this.callback = () => {
            this.setState({loading : true});
            this.componentConfig.postUrl = '/upload?base=' + this.props.sqrInputValue;
            this.setState({value: new Date()});
        }

        this.success = (file : any, data : any) => {
            this.setState({ loading: false });
            this.solution1Path = data;
            this
                .props
                .onSol1Path(data);
            // this.props.uploadSuccess(); tslint:disable-next-line:no-console

        };

        // tslint:disable-next-line:no-console
        this.removedfile = (file : any) => console.log('removing...', file);

        this.dropzone = null;
    }

    public render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            addedfile: this.callback.bind(this),
            drop: this.callbackArray,
            init: (dz : any) => this.dropzone = dz,
            removedfile: this.removedfile,
            success: this.success
        }

        return (<div>
            <div className="spinner"><RingLoader
                color={'#123abc'}
                loading={this.state.loading}
            /> </div>
            <DropzoneComponent
            className="dropzone"
            config={config}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}/>
            
            </div>)
    }
}
export default FileUploader;
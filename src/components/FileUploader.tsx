import * as React from 'react';
import {DropzoneComponent} from 'react-dropzone-component';

class FileUploader extends React.Component {
    public success: any;
    public callback: any;
    public componentConfig: any;
    public callbackArray: any;
    public dropzone: any;
    public removedfile: any;
    public djsConfig: any;
    constructor(props: {}) {
        super(props);

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true
        };

        this.componentConfig = {
            iconFiletypes: ['.sqr', '.zip'],
            postUrl: '/upload',
            showFiletypeIcon: true
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        // tslint:disable-next-line:no-console
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        // tslint:disable-next-line:no-console
        this.callback = () => console.log('Hello!');

        
        this.success = (file: any) => {
            // this.props.uploadSuccess();
            // tslint:disable-next-line:no-console
            console.log('uploaded', file)
        };

        // tslint:disable-next-line:no-console
        this.removedfile = (file: any) => console.log('removing...', file);

        this.dropzone = null;
    }

    public render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            addedfile: this.callback,
            drop: this.callbackArray,
            init: (dz: any) => this.dropzone = dz,
            removedfile: this.removedfile,
            success: this.success,
        }

        return <DropzoneComponent className="dropzone" config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
    }
}
export default FileUploader;
import React from 'react';
import {
    InputGroup, 
    // InputGroupAddon, 
    InputGroupButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    Input,
    Alert
} from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class Url extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            error: '',
            splitButtonShow: false,
            selectedFormat: 'mp4'
        };

        this.url            = '';
        this.formats        = ['mp4', 'mp3'];

        // this.onAddClick     = this.onAddClick.bind(this);
        this.onUrlChanged   = this.onUrlChanged.bind(this);
        this.onDismiss      = this.onDismiss.bind(this);
        this.onSelectFormat = this.onSelectFormat.bind(this);
        this.toggleSplit    = this.toggleSplit.bind(this);
    }

    toggleSplit() { 
        this.setState({ splitButtonShow: !this.state.splitButtonShow });
    }

    testUrl() {
        // No URL
        if(this.url.length < 1) {
            this.setState({ error: 'Empty URL field!' });
            return false;
        }

        // Twice url
        if(this.props.data.find(({ url }) => url === this.url)) {
            this.setState({ error: 'This URL has already been added!' });
            return false;
        }

        // Invalid YouTube URL
        if(!this.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/)) {
            this.setState({ error: 'Invalid YouTube URL!' });
            return false;
        }

        return true;
    }

    // onAddClick() {
    //     // Find completed download and remove
    //     this.props.removeCompleted();

    //     if(this.testUrl()) {
    //         // Get video info
    //         this.props.startDataLoading();
    //         ipcRenderer.send('YouTube:Info', this.url);
    //     }
    // }

    onSelectFormat(e) {
        e.preventDefault();
        this.setState({ selectedFormat: e.target.value });
    }

    onUrlChanged(e) {
        e.preventDefault(); 
        this.url = e.target.value.trim();
    }

    onDismiss() { 
        this.setState({ error: '' });
    }

    componentDidMount() {
        ipcRenderer.on('YouTube:Info:Data', (e, info) => {

            if(info.error) {
                this.props.finishDataLoading();
                this.setState({ error: 'Error to get video url!' });
                return;
            }

            this.props.addUrl({
                url: this.url,
                complete: false,
                format: this.state.selectedFormat,
                converting: false,
                info: info.info,
                error: {
                    status: false,
                    message: ''
                }
            });
            this.props.finishDataLoading();
        });
        ipcRenderer.on('Clipboard:paste:url', (e, url) => {
            this.url = url;
            if(this.testUrl()) {
                this.props.startDataLoading();
                ipcRenderer.send('YouTube:Info', this.url);
            }
        });
    }

    render() {

        const showInput = !this.props.dataLoading && !this.props.downloading;

        return (
            <div>
                {showInput && (
                    <div>
                        <InputGroup>
                            <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.splitButtonShow} toggle={this.toggleSplit}>
                                <Button 
                                    style={{ color: 'black' }}
                                    disabled
                                    outline>
                                        {this.state.selectedFormat.toUpperCase()}
                                </Button>
                                <DropdownToggle split outline />
                                <DropdownMenu>
                                    <DropdownItem header>Select output format</DropdownItem>
                                    {this.formats.map((item, index) => ( 
                                        <div key={index}>
                                            {item !== this.state.selectedFormat && 
                                            <DropdownItem
                                                className="App-dropdown-item"
                                                value={item}
                                                onClick={this.onSelectFormat}>
                                                    {item.toUpperCase()}
                                            </DropdownItem>}
                                        </div>  
                                    ))}
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                            <Input className="App-input" onBlur={this.onUrlChanged} placeholder="Paste url here..." />
                            {/* <InputGroupAddon addonType="append">
                                <Button outline onClick={this.onAddClick} color="secondary">Add</Button>
                            </InputGroupAddon> */}
                        </InputGroup>
                        {this.state.error.length > 0 && (
                            <div>
                                <br />
                                <Alert color="secondary" isOpen={true} toggle={this.onDismiss}>
                                    {this.state.error}
                                </Alert>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
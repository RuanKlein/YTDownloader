import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class AboutInfo extends React.Component {

    constructor(props) {
        super(props);

        this.link        = 'github.com/RuanKlein/YTDownloader';
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    onLinkClick() {
        ipcRenderer.send('About:Link', `https://${this.link}`);
    }

    render() {
        return (
            <div className="text-center">
                <img src="/assets/about.png" className="img-fluid" alt="Developer" />
                <br /><br />
                <h4>YTDownloader 1.0.0</h4>
                <h6>YouTube Downloader for Mp3/Mp4</h6>
                <br />
                <p style={{ fontSize: '13px' }}>
                    2019 {'<ruan.klein@gmail.com>'}<br />
                    <Button onClick={this.onLinkClick} size="sm" color="link">Source Code on GitHub</Button><br /><br />
                    <Link to="/">
                        <Button outline color="primary">Back</Button>
                    </Link>
                </p>

            </div>
        );
    }
}
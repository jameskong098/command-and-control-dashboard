import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Dropdown } from 'react-bootstrap';
import ros_config from '../../configs/ros_config';
import ROSConnect from '../ros-bridge/ROSConnect';
import RosTopicList from '../ros-bridge/RosTopicList';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ros: null,
            rosbridgeServerIP: localStorage.getItem('rosbridgeServerIP') || ros_config.ROSBRIDGE_SERVER_IP,
            rosbridgeServerPort: localStorage.getItem('rosbridgeServerPort') || ros_config.ROSBRIDGE_SERVER_PORT,
            imageWidth: localStorage.getItem('imageWidth') || ros_config.ROSBRIDGE_IMAGE_WIDTH ,
            imageHeight: localStorage.getItem('imageHeight') || ros_config.ROSBRIDGE_IMAGE_HEIGHT,
            imageQuality: localStorage.getItem('imageQuality') || ros_config.ROSBRIDGE_IMAGE_QUALITY,
            batteryStatus: (localStorage.getItem('batteryStatus') !== null && localStorage.getItem('batteryStatus') === 'true') ? true : ros_config.ROSBRIDGE_BATTERY_STATUS,
            batteryTopic: localStorage.getItem('batteryTopic') || ros_config.ROSBRIDGE_BATTERY_TOPIC,
            manualTeleop: (localStorage.getItem('manualTeleop') !== null && localStorage.getItem('manualTeleop') === 'true') ? true : ros_config.ROSBRIDGE_MANUAL_TELEOP,
            invalidIP: false,
            invalidPort: false,
            invalidWidth: false,
            invalidHeight: false,
            showConfig: false
        }

        this.setRos = this.setRos.bind(this);
        this.updateManualTeleopState = this.updateManualTeleopState.bind(this);
        this.toggleConfig = this.toggleConfig.bind(this);
    }

    setRos(ros) {
        this.setState({ ros });
    }

    updateManualTeleopState(newState) {
        localStorage.setItem('manualTeleop', newState);
        return newState;
    }

    updateShowBattery(newState) {
        localStorage.setItem('batteryStatus', newState);
        return newState;
    }

    toggleConfig(isOpen) {
        this.setState({ showConfig: isOpen });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
      
        // Only allow numbers and periods for rosbridgeServerIP
        if (name === "rosbridgeServerIP" && !/^[\d.]+$/.test(value)) {
            this.setState({ invalidIP: true });
            return;
        }

        // Only allow numbers for rosbridgeServerPort, imageWidth, imageHeight, and imageQuality
        if (name === "rosbridgeServerPort" && !/^\d+$/.test(value)) {
            this.setState({ invalidPort: true });
        }
        else if (name === "imageWidth" && !/^\d+$/.test(value)) {
            this.setState({ invalidWidth: true });
        }
        else if (name === "imageHeight" && !/^\d+$/.test(value)) {
            this.setState({ invalidHeight: true });
        }
        else if (name === "imageQuality" && !/^\d+$/.test(value)) {
            this.setState({ invalidQuality: true });
        }
        else {
            this.setState({ [name]: value, invalidIP: false, invalidPort: false, invalidWidth: false, invalidHeight: false, invalidQuality: false });
        }
      
    };

    handleFormSubmit = (event) => {
        event.preventDefault();
    };

    handleSaveClick = () => {
        const storedIP = localStorage.getItem('rosbridgeServerIP');
        const storedPort = localStorage.getItem('rosbridgeServerPort');
        localStorage.setItem('rosbridgeServerIP', this.state.rosbridgeServerIP);
        localStorage.setItem('rosbridgeServerPort', this.state.rosbridgeServerPort);
        localStorage.setItem('imageWidth', this.state.imageWidth);
        localStorage.setItem('imageHeight', this.state.imageHeight);
        localStorage.setItem('imageQuality', this.state.imageQuality);
        localStorage.setItem('batteryTopic', this.state.batteryTopic);
        if (this.state.rosbridgeServerIP !== storedIP || this.state.rosbridgeServerPort !== storedPort) {
            window.location.reload();
        }
    };
      
    render() {
        const { ros, rosbridgeServerIP, rosbridgeServerPort, imageWidth, imageHeight, imageQuality, batteryStatus, batteryTopic, manualTeleop, showConfig } = this.state;
        return (
            <Container style={{ margin: "2%" }}>
                <h1 id="-project-command-control-"><strong>Settings</strong></h1>

                <div className="divider"></div>

                <Row>
                    <Col>
                        <ROSConnect setRos={this.setRos}/>
                    </Col>
                </Row>

                <Form onSubmit={this.handleFormSubmit}>
                    <FormGroup>
                        <Row>
                            <Col>
                                <Form.Label>Rosbridge Server IP Address</Form.Label>
                                <Form.Control name="rosbridgeServerIP" onChange={this.handleInputChange} placeholder="xxx.x.x.x" style={{width: "50%"}}/>
                                {this.state.invalidIP && (
                                    <span style={{ color: "red" }}>
                                    Invalid rosbridge server IP, please re-enter a number value!
                                    </span>
                                )}
                            </Col>
                            <Col>
                                <Form.Label>Port</Form.Label>
                                <Form.Control name="rosbridgeServerPort" onChange={this.handleInputChange} placeholder="Port" style={{width: "20%"}}/>
                                {this.state.invalidPort && (
                                    <span style={{ color: "red" }}>
                                    Invalid rosbridge server port, please re-enter a number value!
                                    </span>
                                )}
                            </Col>
                        </Row>
                    </FormGroup>
    
                    <FormGroup style={{ marginTop: "2%" }}>
                        <Row>
                            <Col>
                                <Form.Label>Image Width</Form.Label>
                                <Form.Control name="imageWidth" onChange={this.handleInputChange} placeholder="Width" style={{width: "20%"}}/>
                                {this.state.invalidWidth && (
                                    <span style={{ color: "red" }}>
                                    Invalid image width input, please re-enter a number value!
                                    </span>
                                )}
                            </Col>
                            <Col>
                                <Form.Label>Image Height</Form.Label>
                                <Form.Control name="imageHeight" onChange={this.handleInputChange} placeholder="Height" style={{width: "20%"}}/>
                                {this.state.invalidHeight && (
                                    <span style={{ color: "red" }}>
                                    Invalid image height input, please re-enter a number value!
                                    </span>
                                )}
                            </Col>
                        </Row>
                    </FormGroup>
    
                    <FormGroup style={{ marginTop: "2%" }}>
                        <Form.Label>Image Quality</Form.Label>
                        <Form.Control name="imageQuality" onChange={this.handleInputChange} placeholder="0-100" style={{width: "20%"}}/>
                        {this.state.invalidQuality && (
                            <span style={{ color: "red" }}>
                            Invalid image quality input, please re-enter a number value!
                            </span>
                        )}
                         <FormGroup style={{ marginTop: "2%" }}>
                            <Form.Check 
                                name="showBattery" 
                                type="checkbox"
                                checked={batteryStatus} 
                                onChange={(event) =>
                                    this.setState({
                                        batteryStatus: Boolean(this.updateShowBattery(event.target.checked)),
                                    })
                                }
                                label="Show Battery Status" />
                            {batteryStatus && (
                                <Form.Control name="batteryTopic" onChange={this.handleInputChange} placeholder="/battery" style={{width: "20%"}}/>
                            )}
                        </FormGroup>
                        <Button onClick={this.handleSaveClick} variant="primary" style={{marginTop: "2%"}}>
                            Save
                        </Button>
                    </FormGroup>

                    <div className="divider"></div>
    
                    <div style={{ display: 'flex', justifyContent: 'row', marginTop: "2%"}}>
                        <RosTopicList ros={ros}/>
                        <Dropdown onToggle={this.toggleConfig} show={this.state.showConfig} style={{marginLeft: "1.5%"}}>
                            <Dropdown.Toggle variant="info">
                            {this.state.showConfig
                                ? 'Hide Current Configuration'
                                : 'Show Current Configuration'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item> [ Rosbridge Server IP ] : {localStorage.getItem('rosbridgeServerIP').toString() || ros_config.ROSBRIDGE_SERVER_IP} </Dropdown.Item>
                                <Dropdown.Item> [ Rosbridge Server Port ]: {localStorage.getItem('rosbridgeServerPort').toString() || ros_config.ROSBRIDGE_SERVER_PORT} </Dropdown.Item>
                                <Dropdown.Item> [ Rosbridge Image Width ]: {localStorage.getItem('imageWidth').toString() || ros_config.ROSBRIDGE_IMAGE_WIDTH} </Dropdown.Item>
                                <Dropdown.Item> [ Rosbridge Image Height ] : {localStorage.getItem('imageHeight').toString() || ros_config.ROSBRIDGE_IMAGE_HEIGHT} </Dropdown.Item>
                                <Dropdown.Item> [ Rosbridge Image Quality ]: {localStorage.getItem('imageQuality').toString() || ros_config.ROSBRIDGE_IMAGE_QUALITY} </Dropdown.Item>
                                <Dropdown.Item> [ Rosbridge Show Battery ]: {localStorage.getItem('batteryStatus') !== null ? (localStorage.getItem('batteryStatus') === 'true' ? 'On' : 'Off') : (ros_config.ROSBRIDGE_BATTERY_STATUS ? 'On' : 'Off')} </Dropdown.Item>
                                {localStorage.getItem('batteryStatus') !== null ?
                                    (localStorage.getItem('batteryStatus') === 'true' ?
                                        <Dropdown.Item>[ Rosbridge Battery Topic ]: {localStorage.getItem('batteryTopic').toString() || ros_config.ROSBRIDGE_BATTERY_TOPIC}</Dropdown.Item>
                                        : null)
                                    : (ros_config.ROSBRIDGE_BATTERY_STATUS ?
                                        <Dropdown.Item>[ Rosbridge Battery Topic ]: {localStorage.getItem('batteryTopic').toString() || ros_config.ROSBRIDGE_BATTERY_TOPIC}</Dropdown.Item>
                                        : null)
                                }
                                <Dropdown.Item> [ Rosbridge Manual Input Teleoperation ]: {localStorage.getItem('manualTeleop') !== null ? (localStorage.getItem('manualTeleop') === 'true' ? 'On' : 'Off') : (ros_config.ROSBRIDGE_MANUAL_TELEOP ? 'On' : 'Off')} </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <FormGroup style={{marginTop: "2%"}}>
                        <Form.Check
                            name="manualTeleop"
                            type="checkbox"
                            label="Manual Input Teleoperation"
                            checked={manualTeleop}
                            onChange={(event) =>
                                this.setState({
                                    manualTeleop: Boolean(this.updateManualTeleopState(event.target.checked)),
                                })
                            }
                        />
                    </FormGroup>

                    
                </Form>
            </Container>
        );
    }
    
}

export default Settings;
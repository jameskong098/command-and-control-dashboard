import React from 'react';
import ros_config from '../../configs/ros_config';

class RosTopicList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { topics: [], showMenu: false };
    }

    componentDidMount() {
        this.getTopicList();
    }

    getTopicList() {
        const { ros } = this.props;
        // if ros is not intialized return
        if (!ros) {
            console.warn('ROS/ RosBridge not intialized');
            return;
        }

        const topicList = new window.ROSLIB.Topic({
            ros: ros,
            name: `${ros_config.ROSBRIDGE_ROSTOPICS_LIST}`,
            messageType: 'std_msgs/String',
        });

        topicList.subscribe((message) => {
            const topics = message.data.split(',');
            this.setState({ topics });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.ros && prevProps.ros !== this.props.ros) {
            this.getTopicList()
        }
    }

    toggleMenu = () => {
        this.setState((prevState) => ({ showMenu: !prevState.showMenu }));
    };

    render() {
        const { topics, showMenu } = this.state;

        return (
            <div className="showTopics">
                <button onClick={this.toggleMenu}>
                    {showMenu ? 'Hide Available Topics' : 'Show Available Topics'}
                </button>
                {showMenu && (
                    <ul>
                        {topics.length === 0 ? <li>No current ROS topics being published!</li> :
                            topics.map((topic, i) => (
                                <li key={i}>{topic}</li>
                            ))
                        }
                    </ul>
                )}
            </div>
        );
    }
}

export default RosTopicList;

import React from 'react';
import ReactDOM from 'react-dom';
import UserPicture from '../../../../common/UserPicture';
let classNames = require('classnames');
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Modal, Header, TextArea} from 'semantic-ui-react';
import {showGroupDetailsModal, hideGroupDetailsModal} from '../../../actions/deckedit/functionsForGroupDetailsModal';

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class GroupDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
      e.preventDefault();
      this.context.executeAction(hideGroupDetailsModal, {});
    }

    render() {
        let members = [];
        //first the creator
        let optionalText = (this.props.group.creator.organization || this.props.group.creator.country) ?
            (this.props.group.creator.organization || 'Unknown organization') + ', ' + (this.props.group.creator.country || 'unknown country') :
            '';
        members.push(
          (
            <div className="item" key={this.props.group.creator.userid}>
              <div className="ui grid">
                <div className="one wide column middle aligned">
                  <UserPicture picture={ this.props.group.creator.picture } username={ this.props.group.creator.username } avatar={ true } width= { 24 } />
                </div>
                <div className="fifteen wide column">
                  <TextArea className="sr-only" id="usernameIsALinkHint" value="The username is a link which will open a new browser tab. Close it when you want to go back to this page." tabIndex ='-1'/>
                  <a className="header" href={'/user/' + this.props.group.creator.username} target="_blank">{this.props.group.creator.username}</a>
                  <div className="description">
                    Group creator
                  </div>
                  {optionalText}
                </div>
              </div>
            </div>
          )
        );
        if (this.props.group.members !== undefined && this.props.group.members.length > 0) {
            this.props.group.members.forEach((user) => {
                optionalText = (user.organization || user.country) ?
                    (user.organization || 'Unknown organization') + ', ' + (user.country || 'unknown country') :
                    '';
                members.push(
                  (
                    <div className="item" key={user.userid}>
                      <div className="ui grid">
                        <div className="one wide column">
                          <UserPicture picture={ user.picture } username={ user.username } avatar={ true } width= { 24 } />
                        </div>
                        <div className="fifteen wide column">
                          <TextArea className="sr-only" id="usernameIsALinkHint" value="The username is a link which will open a new browser tab. Close it when you want to go back to this page." tabIndex ='-1'/>
                          <a className="header" href={'/user/' + user.username} target="_blank">{user.username}</a>
                          {optionalText}
                        </div>
                      </div>
                    </div>
                  )
                );
            });
        }

        return (
            <div className="ui groupdetails modal" ref='groupdetailsmodal' style={modalStyle} role="dialog" aria-labelledby="groupdetailsmodal_header" aria-describedby="groupdetailsmodal_content">
              <div className="header" id="groupdetailsmodal_header">
                  <h1 style={headerStyle}>Group details</h1>
              </div>
              <div className="content" id="groupdetailsmodal_content">
                <div className="ui container">
                  <h3 className="header" >{this.props.group.name}</h3>
                  <p>There are {this.props.group.members.length+1} member{(this.props.group.members.length !== 0) ? 's': ''} in this group.</p>
                  <div className="ui very relaxed  list">
                      {members}
                  </div>
                </div>
              </div>
              <div className="actions">
                <button type="button" className="ui cancel button" role="button" tabIndex="0" onClick={this.handleClose}>
                  <i className="remove icon"/>Close
                </button>
              </div>
            </div>
        );

        window.scrollTo(0, 0);
    }
}

export default GroupDetailsModal;

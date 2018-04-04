import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Button, Container, Form, Modal, Icon, Segment, Grid, TextArea, Input, Label} from 'semantic-ui-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import SlideViewStore from '../../../../stores/SlideViewStore';
import ContributorsStore from '../../../../stores/ContributorsStore';


class EmbedModal extends React.Component {
    constructor(props) {
        super(props);

        this.defaultWidthValue = 800;
        this.defaultHeightValue = 400;

        this.state = {
            modalOpen: false,
            activeTrap: false,
            width: this.defaultWidthValue,
            height: this.defaultHeightValue,
            href: null
        };

        this.handleEmbed = this.handleEmbed.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);

        this.messages = defineMessages({
            embedModal_header:{
                id:'embedModal.embedModal_embedHeader',
                defaultMessage: 'Embed deck'
            },
            embedModal_embedButton:{
                id:'embedModal.embedModal_embedButton',
                defaultMessage: 'Embed'
            },
            embedModal_closeButton:{
                id:'embedModal.embedModal_closeButton',
                defaultMessage: 'Close'
            },
            embedModal_widthLabel:{
                id:'embedModal.embedModal_widthLabel',
                defaultMessage: 'Width of embedded content'
            },
            embedModal_heightLabel:{
                id:'embedModal.embedModal_heightLabel',
                defaultMessage: 'Height of embedded content'
            },
        });
    }

    handleEmbed() {
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleChange() {
        var widthInput = $('#embedModalWidth');
        var heightInput = $('#embedModalHeight');

        this.setState({
            width: widthInput.val() || this.defaultWidthValue,
            height: heightInput.val() || this.defaultHeightValue,
            href: window.location.href
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false
        });
    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    findCurrentRevision(deckData) {
        if (deckData.revisions) {
            return deckData.revisions.length === 1 ? deckData.revisions[0] : deckData.revisions.find((rev) => {
                return rev.id === deckData.active;
            });
        } else {
            return null;
        }
    }

    render() {
        return(
            <Modal
                    trigger={
                        <Button icon="code"
                                color="grey"
                                type="button"
                                onClick={this.handleEmbed}
                                content={this.context.intl.formatMessage(this.messages.embedModal_embedButton)}/>
                    }
                    open={this.state.modalOpen}
                    onOpen={this.handleChange}
                    onClose={this.handleClose}
                    id="embedModal"
                    aria-labelledby="embedModalHeader"
                    aria-describedby="embedModalDescription"
                    aria-hidden = {!this.state.modalOpen}
                    role="dialog"
                    tabIndex="0">
                <FocusTrap
                        id="focus-trap-embedModal"
                        className = "header"
                        active={this.state.activeTrap}
                        focusTrapOptions={{
                            onDeactivate: this.unmountTrap,
                            clickOutsideDeactivates: true ,
                            initialFocus: '#embedModalDescription'
                        }}>
                    <Modal.Header className="ui center aligned" id="embedModalHeader">
                        <h1 style={{'textAlign': 'center'}}>
                            {this.context.intl.formatMessage(this.messages.embedModal_header)}
                        </h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Segment color="blue" textAlign="center" padded>
                                <Segment>
                                    <form className="ui form">
                                        <Form.Field>
                                            <Label>
                                                {this.context.intl.formatMessage(this.messages.embedModal_widthLabel)}
                                            </Label>
                                            <Input id="embedModalWidth"
                                                    placeholder={this.defaultWidthValue}
                                                    onChange={this.handleChange}/>
                                            <Label>
                                                {this.context.intl.formatMessage(this.messages.embedModal_heightLabel)}
                                            </Label>
                                            <Input id="embedModalHeight"
                                                    placeholder={this.defaultHeightValue}
                                                    onChange={this.handleChange}/>
                                        </Form.Field>
                                        <Form.Field>
                                            <textarea id="embedModalDescription"
                                                    ref="embedModalDescription"
                                                    label="description"
                                                    autoHeight={true}
                                                    value={
                                                        '<iframe src="' + this.state.href + '" width="'
                                                        + this.state.width + '" height="' + this.state.height
                                                        + '"></iframe><p>'
                                                        + '<a href="' + this.state.href +'">'
                                                        + ((this.props.ContentStore.selector.stype === 'slide')
                                                        ? this.props.SlideViewStore.title
                                                        : this.findCurrentRevision(this.props.DeckViewStore.deckData)
                                                                .title)
                                                        + ' - '
                                                        + ((this.props.ContentStore.selector.stype === 'slide')
                                                        ? this.props.ContributorsStore.creator[0].username
                                                        : this.props.DeckViewStore.creatorData.username)
                                                        + '</a></p>'
                                                    }/>
                                        </Form.Field>
                                        <Modal.Actions>
                                            <Button icon="remove"
                                                    color="red"
                                                    type="button"
                                                    onClick={this.handleClose}
                                                    content={this.context.intl.formatMessage(this.messages.embedModal_closeButton)}/>
                                        </Modal.Actions>
                                    </form>
                                </Segment>
                            </Segment>
                        </Container>
                    </Modal.Content>
                </FocusTrap>
            </Modal>
        );
    }

}

EmbedModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

EmbedModal = connectToStores(EmbedModal, [ContentStore, UserProfileStore, DeckViewStore, SlideViewStore,
        ContributorsStore], (context, props) => {
            return {
                ContentStore: context.getStore(ContentStore).getState(),
                UserProfileStore: context.getStore(UserProfileStore).getState(),
                DeckViewStore: context.getStore(DeckViewStore).getState(),
                SlideViewStore: context.getStore(SlideViewStore).getState(),
                ContributorsStore: context.getStore(ContributorsStore).getState()
            };
        });

export default EmbedModal;
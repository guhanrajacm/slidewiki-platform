import React from 'react';
import PopularDecks from '../PopularDecks';
<<<<<<< HEAD
=======
import { navigateAction } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';
import { fetchUserDecks } from '../../../../actions/user/userprofile/fetchUserDecks';
import { fetchNextUserDecks } from '../../../../actions/user/userprofile/fetchNextUserDecks';
>>>>>>> master

class UserDecks extends React.Component {
    constructor(props){
        super(props);
<<<<<<< HEAD
        this.sortBy = '2';
=======
        this.messages = this.getIntlMessages();
>>>>>>> master
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

<<<<<<< HEAD
    componentDidUpdate() {}

    dropdownSelect(value) {
        this.sortBy = value;
        this.forceUpdate();
    }

    render() {
=======
    componentDidUpdate() { }

    dropdownSelect(value) {
        this.context.executeAction(fetchUserDecks, {
            params: {
                username: this.props.user.uname, 
                sort: value,
                roles: 'owner',
            }
        });
    }
    loadMore(nextLink){       
        this.context.executeAction(fetchNextUserDecks, {
            nextLink: nextLink
        });
    }
    getIntlMessages(){
        return defineMessages({
            sortLastUpdated: {
                id: 'UserDecks.sort.lastUpdated', 
                defaultMessage: 'Last updated'
            }, 
            sortCreationDate: {
                id: 'UserDecks.sort.date', 
                defaultMessage: 'Creation date'
            },
            sortTitle: {
                id: 'UserDecks.sort.title', 
                defaultMessage: 'Title'
            }, 
            myDecks: {
                id: 'UserDecks.header.myDecks', 
                defaultMessage: 'My Decks'
            }, 
            ownedDecks: {
                id: 'UserDecks.header.ownedDecks', 
                defaultMessage: 'Owned Decks'
            }
        });
    }
    getSelectedSort(sortBy){
        switch(sortBy){
            case 'timestamp': 
                return this.context.intl.formatMessage(this.messages.sortCreationDate);
            case 'title':
                return this.context.intl.formatMessage(this.messages.sortTitle);
            case 'lastUpdate': 
            default: 
                return this.context.intl.formatMessage(this.messages.sortLastUpdated);
        }
    }
    render() {
         // define load more results div
        let loadMoreDiv = '';
        let meta = this.props.decksMeta;
        if(meta.links && meta.links.next){
            let loadMoreContent = <button className="ui button" aria-label='Load more decks' onClick={this.loadMore.bind(this, meta.links.next)}>Load More</button>;
            if(this.props.loadMoreLoading){
                loadMoreContent = <div className="ui active text loader">Loading</div>;
            }
            if(this.props.loadMoreError){
                loadMoreContent = 'An unexpected error occurred while fetching more decks';
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }
        let sortBy = meta.sort;
        let header = (this.props.loggedinuser === this.props.user.uname) 
            ? this.context.intl.formatMessage(this.messages.myDecks)
            : this.context.intl.formatMessage(this.messages.ownedDecks);
            
>>>>>>> master
        return (
          <div className="ui segments">
            {(this.props.decks === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
            <div className="ui secondary clearing segment">
<<<<<<< HEAD
                <h1 className="ui left floated header">{(this.props.loggedinuser === this.props.user.uname) ? 'My Decks' : 'Owned Decks' }</h1>
                <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                    <i className="icon exchange" aria-label="change order" />
                    <div className="text">Last updated</div>
                    <div className="menu">
                        <div className="item active selected" data-value={2}>Last updated</div>
                        <div className="item" data-value={1}>Creation date</div>
                        <div className="item" data-value={0}>Title</div>
=======
                <h1 className="ui left floated header">{header}</h1>
                <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                    <i className="icon exchange"/>
                    <div className="text">{this.getSelectedSort(sortBy)}</div>
                    <div className="menu">
                        <div className={(sortBy === 'lastUpdate') ? 'item active selected' : 'item'} data-value='lastUpdate'>{this.context.intl.formatMessage(this.messages.sortLastUpdated)}</div>
                        <div className={(sortBy === 'timestamp') ? 'item active selected' : 'item'} data-value='timestamp'>{this.context.intl.formatMessage(this.messages.sortCreationDate)}</div>
                        <div className={(sortBy === 'title') ? 'item active selected' : 'item'} data-value='title'>{this.context.intl.formatMessage(this.messages.sortTitle)}</div>
>>>>>>> master
                    </div>
                </div>
            </div>
            <div className="ui segment">
<<<<<<< HEAD
                <PopularDecks size={0} decks={this.props.decks} sort={this.sortBy}/>
            </div>
=======
                { (this.props.decks) && 
                    <PopularDecks size={0} decks={this.props.decks} />
                }
            </div>
            {loadMoreDiv}
>>>>>>> master
          </div>
        );
    }
}

UserDecks.contextTypes = {
<<<<<<< HEAD
    executeAction: React.PropTypes.func.isRequired
=======
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
>>>>>>> master
};

export default UserDecks;

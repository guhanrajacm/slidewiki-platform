import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AdvancedSearchStore from '../../../stores/AdvancedSearchStore';
import loadAdvancedSearchResults from '../../../actions/search/loadAdvancedSearchResults';
import SearchResultsPanel from '../SearchResultsPanel/SearchResultsPanel';


class AdvancedSearch extends React.Component {

    handleRedirect(searchstring, deckid, userid){
        this.context.executeAction(navigateAction, {
            url:  '/search/advsearchresults/searchstring=' + this.refs.searchstring.value +
                  '/entity=' + this.refs.entity.value +
                  '/searchlang=' + this.refs.searchlang.value +
                  '/deckid=' + this.refs.deckid.value +
                  '/userid=' + this.refs.userid.value
        });
        return false;
    }

    render() {

        return (

                <div className="ui content">
                    <h2 className="ui header">Advanced Search</h2>

                    <form className="ui form success">
                        <div className="field">
                            <input name='searchstring' placeholder='Text search' type='text' ref='searchstring'></input>
                        </div>

                        <div className="four fields">
                            <div className="field">
                                <label>Entity</label>
                                <select name='entity' multiple='' className='ui fluid search dropdown' ref='entity'>
                                  <option value=''>Select Entity</option>
                                  <option value='slide'>Slide</option>
                                  <option value='deck'>Deck</option>
                                  <option value='answer'>Answer</option>
                                  <option value='question'>Question</option>
                                  <option value='comment'>Comment</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>Language</label>
                                <select name='lang' multiple='' className='ui fluid search dropdown' ref='searchlang'>
                                  <option value=''>Select Language</option>
                                  <option value='EN'>English</option>
                                  <option value='ES'>Spanish</option>
                                  <option value='GR'>Greek</option>
                                </select>
                            </div>



                            <div className='field'>
                                <label>Deck id</label>
                                <input name='deckid' placeholder='Deck id' type='text' ref='deckid'></input>
                            </div>

                            <div className='field'>
                                <label>User id</label>
                                <input name='userid' placeholder='User id' type='text' ref='userid'></input>
                            </div>
                        </div>

                        <div class="ui checkbox" style={{marginTop: '1em', marginBottom: '1em'}}>
                            <input name="revisions" type="checkbox"></input>
                            <label>Include revisions</label>
                        </div>

                        <div className="ui primary submit labeled icon button" onClick={this.handleRedirect.bind(this)}>
                            <i className="icon edit"></i> Submit
                        </div>

                    </form>

                </div>


        );
    }
}

AdvancedSearch.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AdvancedSearch = connectToStores(AdvancedSearch, [AdvancedSearchStore], (context, props) => {
    return {
        AdvancedSearchStore: context.getStore(AdvancedSearchStore).getState()
    };
});


export default AdvancedSearch;

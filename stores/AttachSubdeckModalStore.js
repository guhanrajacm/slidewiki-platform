import {BaseStore} from 'fluxible/addons';
import { isEmpty } from '../common.js';

class AttachSubdeckModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.userDecks = [];
        this.recentDecks = [];
        this.searchDecks =[];
        this.selectedDeckTitle='Select one deck...';
        this.selectedDeckId =-1;
    }

    getState(){
        return {
            userDecks : this.userDecks,
            recentDecks: this.recentDecks,
            selectedDeckTitle: this.selectedDeckTitle,
            selectedDeckId: this.selectedDeckId
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.userDecks = state.userDecks;
        this.recentDecks = state.recentDecks;
        this.selectedDeckTitle = state.selectedDeckTitle;
        this.selectedDeckId = state.selectedDeckId;
    }

    updateUserDecks(payload){

        Object.assign(this.userDecks, payload);
        this.emitChange();
    }

    updateSelectedDeck(payload){
        this.selectedDeckTitle = payload.selectedDeckTitle;
        this.selectedDeckId = payload.selectedDeckId;
        this.emitChange();
    }
    updateRecentDecks(payload){
        if(payload.recent===[]){
            this.recentDecks =[];
        } else{
            let recentDecks = payload.recent.map((deck) => {
                return({
                    title: !isEmpty(deck.title) ? deck.title : 'No Title',
                    picture: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Business_presentation_byVectorOpenStock.jpg',
                    description: !isEmpty(deck.description) ? deck.description : 'No Description',
                    //updated: !isEmpty(deck.lastUpdate) ? deck.lastUpdate : (new Date()).setTime(1).toISOString(),
                    updated:deck.lastUpdate,
                    //creationDate: !isEmpty(deck.timestamp) ? deck.timestamp : (new Date()).setTime(1).toISOString(),
                    creationDate: deck.timestamp,
                    deckID: deck._id,
                    firstSlide: deck.firstSlide,
                    language:deck.language,
                    countRevisions:deck.countRevisions,
                    deckCreatorid:deck.user,
                    deckCreator:deck.username

                });

            }); //map
            Object.assign(this.recentDecks, recentDecks);
        }
        this.emitChange();
    }

    updateSearchDecks(payload){
        Object.assign(this.recentDecks, payload.docs);

    }



}
AttachSubdeckModalStore.storeName = 'AttachSubdeckModalStore';
AttachSubdeckModalStore.handlers = {
    'ATTACHSUBDECK_LOAD_USERDECKS' : 'updateUserDecks',
    'ATTACHSUBDECK_SELECTED_DECK' : 'updateSelectedDeck',
    'ATTACHSUBDECK_LOAD_RECENTDECKS': 'updateRecentDecks',
    'ATTACHSUBDECK_LOAD_SEARCHDECKS' : 'updateSearchDecks'

};

export default AttachSubdeckModalStore;

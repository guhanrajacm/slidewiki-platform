import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';
const log = require('../log/clog');
import async from 'async';

export default function forkDeck(context, payload, done) {
    log.info(context);
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;
    if (userid == null || userid === '') {
        context.executeAction(navigateAction, {
            url: '/'
        });
        done();
    } else {
        let selector = payload.selector;
        context.service.update('deck.fork', {deckId: selector.id, jwt: context.getStore(UserProfileStore).jwt}, null, {timeout: 30 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                if (err.statusCode === 401) {
                    context.dispatch('FORK_DECK_FAILURE', err);
                }
                done();
            } else {
                context.dispatch('FORK_DECK_SUCCESS', res);
                console.log('res', res);
                let newURL, newId = res.root_deck;
                // by default after forking a deck, navigate to the same position that was shown before
                // unless the navigateToRoot parameter is set
                newURL = '/deck/' + newId;
                if (!payload.navigateToRoot){
                    let newSid = selector.stype === 'deck' ? res.id_map[selector.sid] : selector.sid;
                    if (newSid != null){
                        let pathArr = selector.spath.split(';');
                        let newSpath = pathArr.map((node, index) => {
                            if (index === pathArr.length - 1 && selector.stype === 'slide'){
                                return node;
                            }
                            let splitNode = node.split(':');
                            splitNode[0] = res.id_map[splitNode[0]] || splitNode[0];
                            return splitNode.join(':');
                        }).join(';');
                        newURL = '/deck/' + newId + '/' + selector.stype + '/' + newSid;
                        if (newSpath !== ''){
                            newURL += '/' + newSpath;
                        }
                        if (payload.mode === 'edit'){
                            newURL += '/edit';
                        }
                    }
                }

                userid = String(context.getStore(UserProfileStore).userid);

                async.parallel([
                    (callback) => {
                        //create a fork activity for the origin deck
                        let activity1 = {
                            activity_type: 'fork',
                            user_id: userid,
                            content_id: selector.id,
                            content_kind: 'deck',
                            fork_info: {
                                content_id: newId
                            }
                        };
                        context.executeAction(addActivity, {activity: activity1}, callback);
                    },
                    (callback) => {
                        //create an add activity for the new deck
                        let activity2 = {
                            activity_type: 'add',
                            user_id: userid,
                            content_id: newId,
                            content_owner_id: userid,
                            content_kind: 'deck'
                        };
                        context.executeAction(addActivity, {activity: activity2}, callback);
                    }
                ], (err, results) => {
                    //update the URL
                    location.pathname = newURL;
                    done();
                });
            }          
        });
    }
}

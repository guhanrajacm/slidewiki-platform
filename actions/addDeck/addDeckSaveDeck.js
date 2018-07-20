import {shortTitle} from '../../configs/general';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';

export default function addDeckSaveDeck(context, payload, done) {
    log.info(context);
    //enrich data
    payload.jwt = context.getStore(UserProfileStore).jwt;

    //no pptx uploaded
    if (payload.deckId === null) {
        context.service.create('deck.create', payload, null, {timeout: 30 * 1000}, (err, res) => {
            //console.log('Action addDeckSaveDeck: got', err, res);
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('CREATION_FAILURE', err);
            } else {
                context.dispatch('CREATION_SUCCESS', res);
                createActivity(res);
            }
            done();
        });
    }
    else {
        context.service.update('deck.update', payload, null, {timeout: 30 * 1000}, (err, res) => {
            //console.log('Action addDeckSaveDeck: got', err, res);
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('CREATION_FAILURE', err);
            } else {
                context.dispatch('CREATION_SUCCESS', res);
                createActivity(res);
            }
            done();
        });
    }
}

function createActivity(deck) {
    let activity = {
        activity_type: 'add',
        user_id: String(deck.user),
        content_id: `${deck.id}-1`,
        content_name: deck.title,
        content_owner_id: String(deck.user),
        content_kind: 'deck'
    };
    context.executeAction(addActivity, {activity: activity});
}

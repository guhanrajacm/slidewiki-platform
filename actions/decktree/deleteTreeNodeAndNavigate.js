import async from 'async';
import DeckTreeStore from '../../stores/DeckTreeStore';
import deleteTreeNode from './deleteTreeNode';
const log = require('../log/clog');
import {navigateAction} from 'fluxible-router';
import Util from '../../components/common/Util';
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteTreeNodeAndNavigate(context, payload, done) {
    log.info(context);

    let callback = (accepted) => {
        //load all required actions in parallel
        async.parallel([
            (callback) => {
               context.executeAction(deleteTreeNode, payload, callback);
            }
        ],
           // final callback
        (err, results) => {
            if (!err) {
               //the logic for retrieving the parent node is handles in the stores
               //therefore, we need to get access to the selector from the store
               let currentState = context.getStore(DeckTreeStore).getState();
               let selector = {
                   id: currentState.selector.get('id'),
                   stype: currentState.selector.get('stype'),
                   sid: currentState.selector.get('sid'),
                   spath: currentState.selector.get('spath')
               };
               context.executeAction(navigateAction, {
                   url: Util.makeNodeURL(selector, 'deck', 'view', undefined, undefined, true)
               });
           } else {
               log.error(context, {filepath: __filename});
             //context.executeAction(serviceUnavailable, payload, done);
           }
           done();
       });
    };

    if (payload.selector && !payload.id) {
        return callback(true);
    }

    let elementTitle = payload.stype;
    if(elementTitle === 'deck')
        elementTitle = 'sub' + elementTitle;
    swal({
        title: 'Delete '+elementTitle+'. Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'

    }).then(callback, (reason) => {/*do nothing*/}).catch(swal.noop);
}

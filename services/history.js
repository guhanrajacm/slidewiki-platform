import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'history',

    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        if (resource === 'history.changes') {
            let changesPromise = args.slideId == null ? rp.get({uri: Microservices.deck.uri + '/deck/' + args.deckId + '/changes', json: true}) :
                rp.get({uri: Microservices.deck.uri + '/slide/' + args.slideId + '/changes', qs:{root: args.deckId}, json: true});

            changesPromise.then((changes) => {
                if (!changes.length){
                    return changes;
                }
                //find unique user ids in change log
                let userIds = [... new Set(changes.map((changeOp) => changeOp.user).filter((u) => !!u))];
                return rp.post({uri: Microservices.user.uri + '/users', body: userIds, json: true}).then((users) => {
                    changes.forEach((changeOp) => {
                        let opUser = users.find((user) => user._id === changeOp.user);
                        if (opUser) changeOp.username = opUser.username;
                    });
                    return changes;
                });
            }).then((changes) => {
                callback(null, changes);
            }).catch((err) => callback(err));
            //returns the number of revisions of a deck
        } else if (resource === 'history.revisionCount'){
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.deckId + '/revisionCount/'}).then((res) => {
                callback(null, {count: JSON.parse(res)});
            }).catch((err) => {
                callback({msg: 'Error in retrieving revisions count', content: err}, {});
            });
            //returns the revisions of a deck
        } else if (resource === 'history.revisions') {
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.deckId + '/revisions', json: true}).then((revisions) => {
                //keep only revisions up to the given revision id
                if (args.revisionId != null){
                    revisions = revisions.slice(revisions.findIndex((rev) => rev.id === args.revisionId));
                }
                //find unique user ids in revisions
                let userIds = [... new Set(revisions.map((rev) => rev.user))];
                return rp.post({uri: Microservices.user.uri + '/users', body: userIds, json: true}).then((users) => {
                    revisions.forEach((rev) => {
                        rev.username = users.find((user) => user._id === rev.user).username;
                    });
                    return revisions;
                });
            }).then((revisions) => {
                callback(null, {
                    revisions: revisions
                });
            }).catch((err) => callback(err));
        }
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        //creates a new revision of a deck
        if (resource === 'history.revision') {
            rp({
                method: 'POST',
                uri: Microservices.deck.uri + '/deck/' + params.id + '/revision',
                json: true,
                body: {
                    top_root_deck: params.id
                },
                headers: { '----jwt----': params.jwt }
            }).then((deck) => {
                if (!deck.id) deck.id = deck._id;
                return deck;
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        }
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        if (resource === 'history.revert') {
            rp.post({
                uri: Microservices.deck.uri + '/' + params.selector.stype + '/' + params.selector.sid.split('-')[0] + '/revert',
                json: true,
                body: {
                    revision_id: String(params.revisionId),
                    top_root_deck: params.selector.id
                },
                headers: { '----jwt----': params.jwt }
            }).then((res) => {
                // TODO remove these after api changes
                if (res.revisions) {
                    res.id = res._id;
                    res.revision = res.revisions[0].id;
                    res.title = res.revisions[0].title;
                }

                callback(null, res);
            }).catch((err) => {
                callback(err, {
                    error: err
                });
            });
        }
    }
};

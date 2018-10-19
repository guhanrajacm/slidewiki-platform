import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';

export default function addTreeNode(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with jwt
        payload.jwt = context.getStore(UserProfileStore).jwt;
        context.service.create('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('ADD_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('ADD_TREE_NODE_SUCCESS', res);
                let activityType = (payload.attach) ? 'attach' : 'add';
                let activity = {
                    activity_type: activityType,
                    user_id: String(userid),
                    content_owner_id: String(context.getStore(UserProfileStore).userid),
                    content_name: res.node.title,
                    content_id: String(res.node.id),
                    content_kind: res.node.type
                };
                context.executeAction(addActivity, {activity: activity});
            }
            done(null, res);
        });
    }
}

import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function cancelClick(context, payload, done) {
    context.dispatch('CANCEL_CLICK', {
        selector: payload.selector
    });
}

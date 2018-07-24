import UserProfileStore from '../../stores/UserProfileStore';
import {Microservices} from '../../configs/microservices';
const log = require('../log/clog');

export default function uploadMediaFile(context, payload, done) {
    log.info(context);

    payload.userid = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.dispatch('START_UPLOADING_MEDIA_FILE', {type: payload.type, name: payload.title});

    context.service.create('media.create', payload, { timeout: 20 * 1000 }, { timeout: 20 * 1000 }, (err, res) => {
        delete payload.jwt;
        delete payload.userid;

        if (err) {
            // Every file send to the file-service gets checked if its distinct, if so 409 is returned
            // All images of all users are regarded thus the 409 response is really common
            if (err.statusCode === 409) {
                let parts = err.message.split(' ');
                let filename = parts[parts.length-1];
                filename = filename.substring(0, filename.length - 4);
                payload.url = Microservices.file.uri + '/picture/' + filename;

                let thumbnailName = filename.substring(0, filename.lastIndexOf('.')) + '_thumbnail' + filename.substr(filename.lastIndexOf('.'));
                payload.thumbnailUrl = Microservices.file.uri + '/picture/' + thumbnailName;

                console.log('Got 409 from file service', payload);
                context.dispatch('SUCCESS_UPLOADING_MEDIA_FILE', payload);
            }
            else {
                context.dispatch('FAILURE_UPLOADING_MEDIA_FILE', err);
            }
        }
        else {
            let subPath = res.type === 'image/svg+xml' ? '/graphic/' : '/picture/';
            payload.url = Microservices.file.uri + subPath + res.fileName;
            payload.thumbnailUrl = Microservices.file.uri + subPath + res.thumbnailName;
            if(res.type === 'image/svg+xml') {
                context.service.read('media.readCSV', {url: payload.url}, { timeout: 20 * 1000 }, (err, res) => {
                    // context.dispatch('OPEN_WITH_SRC', {url: url, svg: res});
                    payload.svg = res;
                    context.dispatch('SUCCESS_UPLOADING_MEDIA_FILE', payload);
                    done();
                });
            } else {
                context.dispatch('SUCCESS_UPLOADING_MEDIA_FILE', payload);
                done();
            }
            /**/
        }
        done();
    });
}

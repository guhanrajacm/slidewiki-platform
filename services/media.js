import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;
import formdata from 'form-data';

export default {
    name: 'media',
    create: (req, resource, params, config, emptyObject, callback) => {
        if (resource === 'media.create') {
            // It was hard to send a files data to the service.
            // giving the file as parameter to here is not possible because it gets parsed before send via https
            // FileReader does not create Array buffers (is just undefined)
            // Not all outputs of FileReader are accepted by the API
            // form-data could not be used because the API does not expect multiform

            //NOTE available but currently not used params: copyrightHolderURL and copyrightAdditions
            let holder = '';
            //if(context.getUser() && context.getUser().username) holder = context.getUser().username + ', id=' + params.userID; else holder = params.userID;
            if (params.license === 'CC0')
                holder = '';
            else if (params.copyrightHolder === '' && params.copyrightHolder === '')
                holder = '&copyrightHolder=' + encodeURIComponent(params.userID); //NOTE prefer to use a real world name or the username at SlideWiki + it's ID
            else
                holder = '&copyrightHolder=' + encodeURIComponent(params.copyrightHolder); //NOTE prefer to use a real world name or the username at SlideWiki + it's ID

            let url = Microservices.file.uri + '/v2/picture?' +
                'license=' + encodeURIComponent(params.license) +
                 holder +
                '&title=' + encodeURIComponent(params.title) +
                '&altText='+encodeURIComponent(params.text);
            let headers = {
                '----jwt----': params.jwt,
                'content-type': params.type
            };
            let body = params.type === 'image/svg+xml' ? params.bytes : new Buffer(params.bytes.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
            rp.post({
                uri: url,
                body: body,
                headers: headers,
                json: false
            })
                .then((res) => {
                    console.log('response from saving image:', res);
                    //callback(null, res);
                    callback(null, JSON.parse(res));
                })
                .catch((err) => {
                    console.log('Error while saving image', (err.response) ? {body: err.response.body, headers: err.response.request.headers} : err);
                    callback(err, null);
                });
        }
        else if (resource === 'media.uploadProfilePicture') {
            let url = Microservices.file.uri + '/profilepicture/' + params.username;
            let headers = {
                '----jwt----': params.jwt,
                'content-type': params.type
            };
            rp.put({
                uri: url,
                body: new Buffer(params.bytes.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64'),
                headers: headers
            })
                .then((res) => {
                    // console.log('media: response from saving image:', res);
                    callback(null, Microservices.file.uri + JSON.parse(res).url);
                })
                .catch((err) => {
                    // console.log('media: Error while saving image', (err.response) ? {body: err.response.body, headers: err.response.request.headers} : err);
                    callback(err, null);
                });
        }
    }
};

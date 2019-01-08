import Logger from '../helpers/logger';
import database from '../helpers/database';
import fm from '../helpers/fileManager';
import uuid from 'uuid/v4';

const logger = Logger.getLogger();
const db = new database();

const functions = {};

functions.saveBasic = function (basicData) {
    let folderId;

    if (basicData.folderId && basicData.folderId !== null && typeof (basicData.folderId) != 'undefined') {
        const { folderId: currentId } = basicData;

        folderId = currentId;
    } else {
        folderId = uuid();
    }

    return fm.saveBasicImages(folderId, basicData.avatar, basicData.profile).then((paths) => {
        let pendingFunction;
        let sql;
        const data = [
            folderId,
            paths.avatar,
            paths.profile,
            basicData.name,
            basicData.address_1,
            basicData.address_2,
            basicData.address_3,
            basicData.city,
            basicData.summary,
            basicData.show_referees ? 1 : 0,
            basicData.show_repositories ? 1 : 0
        ];

        if (basicData.id && basicData.id !== null && typeof (basicData.id) != 'undefined') {
            const col = [
                'folder_id',
                'avatar_img',
                'profile_img',
                'name',
                'address_1',
                'address_2',
                'address_3',
                'city',
                'summary',
                'show_referees',
                'show_repositories'
            ];

            pendingFunction = db.update;

            sql = {
                table: 'basic',
                col: col,
                data: data,
                conditions: `id = ${basicData.id}`
            }
        } else {
            pendingFunction = db.insert;

            sql = {
                table: 'basic',
                col: 'folder_id, avatar_img, profile_img, name, address_1, address_2, address_3, city, summary, show_referees, show_repositories',
                data: data
            }
        }

        return pendingFunction(sql).then((res) => {
            if (res.insertId > 0) {
                return Promise.resolve(res.insertId);
            } else {
                return Promise.resolve(basicData.id);
            }
        }).catch((err) => {
            logger.error(`Database Error: ${err}`);

            return Promise.reject({
                method: 'saveBasic',
                err: err
            });
        });

    }).catch((err) => {
        logger.error(`File Error: ${err}`)

        return Promise.reject({
            method: 'saveBasic',
            err: err
        });
    });
}

export default functions;

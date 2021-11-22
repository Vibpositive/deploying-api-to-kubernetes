/* eslint-disable no-unused-vars */
const Service = require('./Service');
const logger = require('../logger');

var os = require('os');

/**
* List My Info
*
* personDetails PersonDetails Process your info from API
* no response value expected for this operation
* */
const listMyInfo = ({ personDetails }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        personDetails,
      }));
      logger.info(os.hostname());
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  listMyInfo,
};

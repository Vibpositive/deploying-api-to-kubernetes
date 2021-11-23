/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create a pet
*
* no response value expected for this operation
* */
const createPets = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* List all pets
*
* limit Integer How many items to return at one time (max 100) (optional)
* returns List
* */
const listPets = ({ limit }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        limit,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Info for a specific pet
*
* petId String The id of the pet to retrieve
* returns List
* */
const showPetById = ({ petId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        petId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createPets,
  listPets,
  showPetById,
};

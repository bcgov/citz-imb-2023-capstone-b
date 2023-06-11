/**
 * @summary Location Endpoint will send all locations and unique services
 *          (Offline functionality requires having locations cached)
 * @author  LocalNewsTV
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import SingleLocation from '../types/SingleLocation';
import httpResponses from '../utils/httpResponse';

dotenv.config();
const locationsModel = mongoose.model('location');

/** @desc List of service locations available in the Database */
const servicesOffered = [
  'ServiceBC',
  'HealthBC',
];

/** @desc Server response object when using the GET method */
type ResponseObject = {
  serviceBCLocations: Array<SingleLocation>;
  serviceBCServices: Array<string>;
  healthBCLocations: Array<SingleLocation>;
  healthBCServices: Array<string>;
}

const extractServiceList = (locations: Array<SingleLocation>): Array<string> => {
  const result: Array<string> = [];
  locations.forEach((location) => result.push(...location.services));
  return [...new Set(result.sort())];
};

/**
 * @desc Takes all SingleLocations from database then creates a unique
 *       list of alphabetically organized services. Data is used by Wayfinder
 *       application to seed the cache.
 * @summary sends seed data for frontend
 * @example {
 *  "serviceBCLocations": [{...}],
 *  "serviceBCServices" : [""],
 *  "healthBCLocations": [{}],
 *  "healthBCServices": [""],
 * }
 * @returns {ResponseObject} Array of Sites by Location
 */
export const getAllLocations = async (req: Request, res: Response): Promise<Response> => {
  const responseObject: ResponseObject = {} as ResponseObject;
  // Get Locations lists
  responseObject.serviceBCLocations = await locationsModel.find({ serviceType: 'ServiceBC' });
  responseObject.healthBCLocations = await locationsModel.find({ serviceType: 'HealthBC' });
  // Gather unique Services List
  responseObject.healthBCServices = extractServiceList(responseObject.healthBCLocations);
  responseObject.serviceBCServices = extractServiceList(responseObject.serviceBCLocations);
  // Ship results to client
  return res.status(200).json(responseObject);
};

/**
 * @desc    To reduce load on reseeding updated data, Sends location data specific to one Service
 * @summary Sends smaller data chunk for less data size.
 * @typedef { Object } ResponseObject
 * @property { Array } locationData Array of @type {SingleLocations}
 * @property { Array } serviceData String Array of @type {string}
 * @returns Returns services and locations of a single type e.g.: ServiceBC, HealthBC
 */
export const locationByCriteria = async (req: Request, res: Response): Promise<Response> => {
  if (servicesOffered.includes(req.body.serviceType)) {
    const locationData: Array<SingleLocation> = await locationsModel.find({
      serviceType: req.body.serviceType,
    });
    const serviceData: Array<string> = extractServiceList(locationData);
    const response: Object = {
      locationData,
      serviceData,
    };
    return res.status(200).json(response);
  }
  return res.status(400).send(httpResponses[400]);
};

/**
 * @desc    Designed for the Web Scraper in mind, uses a secret for bearer authorization
 *          Updates and posts location data to the database and an end step to the scraping process
 *          Using the API eliminates additional db connections.
 *          Does not use an upsert as Mongoose doesn't directly enforce Schema validation in it
 * @type    { SingleLocation }
 * @summary PATCH call for Update/Insert operation on Database from Web Scraper
 */
export const updateLocations = async (req: Request, res: Response): Promise<Response> => {
  if (req.headers.authorization
    && req.headers.authorization.startsWith('Bearer ')
    && req.headers.authorization.split(' ')[1] === process.env.SCRAPER_API_KEY) {
    if (await locationsModel.findOne({ website: req.body.website })) {
      await locationsModel.updateOne({ website: req.body.website }, req.body);
      res.status(204).send(httpResponses[204]);
    } else {
      try {
        await locationsModel.create(req.body);
        return res.status(201).send(httpResponses[201]);
      } catch (ex) {
        return res.status(400).send(httpResponses[400]);
      }
    }
  }
  return res.status(403).send(httpResponses[403]);
};

// src/controller/SiteController.js
import { multipleMongooseToObject } from '../util/mongoose.js';
import Objective from '../models/ObjectiveModel.js';
import Kr from '../models/KRModel.js';
import Krcon from '../models/KRConModel.js';
import User from '../models/UserModel.js';
import KrModel from '../models/KRModel.js';
import mongoose from 'mongoose'; // Import mongoose using ES6 syntax

// Your existing code follows...

class PicController {
    //[GET] /home
    async index(req, res, next) {
        try {
            const objectives = await User.find({});
            res.render('user', {
                courses: multipleMongooseToObject(objectives),
            });
            console.log(objectives.length ? objectives : 'No objectives found');
        } catch (err) {
            console.error(`Error in fetching objectives: ${err.message}`);
            next(err);
        }
    }

    async listOb(req, res, next) {
        const id = req.params.id; // Example: "67763ade122bb6a4bbe70327"
        try {
            // Validate if id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid ObjectId');
            }
    
            // Fetch user details
            const picman = await User.findById(id);
            if (!picman) {
                throw new Error('User not found');
            }
    
            console.log('picman:', picman);  // Log picman to check its properties
    
            // Ensure picman.name exists and is being correctly used in the query
            const objective = await Objective.find({ pic: picman.name });
            console.log('Objective:', objective); // Check if we found the objective
    
            const kr = await KrModel.find({ pic: picman.name });
            console.log('KR:', kr); // Check if we found the KR
    
            const krcon = await Krcon.find({ pic: picman.name });
            console.log('KRcon:', krcon); // Check if we found the KRcon
    
           
    
            // Render the page with the fetched data
            res.render('objectuser', {
                
                name: picman.name,
                kr: multipleMongooseToObject(kr),
                krcon: multipleMongooseToObject(krcon),
                objective: multipleMongooseToObject(objective) // Render objectives as well, if needed
            });
    
        } catch (err) {
            console.error(`Error in fetching objectives: ${err.message}`);
            next(err);  // Pass the error to the error handling middleware
        }
    }
    

    //[GET] /search/:id
    async search(req, res, next) {
        const id = req.params.id; // Example: "O-2024.10.3"
        try {
            // Step 1: Find the User by its ID
            const picman = await User.findById(id);  // Corrected to pass `id` directly
            if (!picman) {
                console.log(`User not found for ID: ${id}`);
                return res.render('news', { 
                    krList: [], 
                    message: `No User found for the given ID: ${id}` 
                });
            }

            // Step 2: Find Objective by `pic` field (from picman)
            const objective = await Objective.findOne({ pic: picman.name });

            if (!objective) {
                console.log(`Objective not found for User: ${picman.name}`);
                return res.render('news', { 
                    krList: [], 
                    message: `No Objective found for the given User` 
                });
            }

            // Step 3: Find KRs where OId matches the Objective's _id
            const krList = await Kr.find({ OId: objective._id });

            console.log(`Found ${krList.length} KRs for Objective ID: ${objective._id}`);
            console.log(krList);

            if (!krList.length) {
                console.log(`No KR found for Objective ID: ${objective._id}`);
                return res.render('news', { 
                    krList: [], 
                    message: 'No KR found for the given Objective.' 
                });
            }

            const courses = krList.map(course => course.toObject ? course.toObject() : course);
            
            res.render('news', {
                courses: courses,
                oid: objective._id,
            });
        } catch (err) {
            console.error(`Error in fetching KRs for ID ${id}: ${err.message}`);
            next(err);
        }
    }

    async searchcon(req, res, next) {
        const id = req.params.id; // Example: "O-2024.10.3"
        try {
            // Step 1: Find the Objective or KR by its ID (if `id` is in Kr model)
            const objective = await Kr.findOne({ id });  // Assuming Kr has an 'id' field
            
            if (!objective) {
                console.log(`Objective not found for ID: ${id}`);
                return res.render('news', { 
                    krList: [], 
                    message: `No Objective found for the given ID: ${id}` 
                });
            }

            // Step 2: Find KRs where KrId matches the Objective's _id in Krcon model
            const krList = await Krcon.find({ KrId: objective._id });

            console.log(`Found ${krList.length} KRs for Objective ID: ${objective._id}`);
            console.log(krList);

            if (!krList.length) {
                console.log(`No KR found for Objective ID: ${objective._id}`);
                return res.render('news', { 
                    krList: [], 
                    message: 'No KR found for the given Objective.' 
                });
            }

            const courses = krList.map(course => course.toObject ? course.toObject() : course);

            res.render('krcon', {
                courses: courses,
                oid: objective._id,
            });
        } catch (err) {
            console.error(`Error in fetching KRs for ID ${id}: ${err.message}`);
            next(err);
        }
    }
}

export default new PicController();

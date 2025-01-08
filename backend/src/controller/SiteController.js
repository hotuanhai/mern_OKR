// src/controller/SiteController.js
import { multipleMongooseToObject } from '../util/mongoose.js';
import Objective from '../models/ObjectiveModel.js';
import Kr from '../models/KRModel.js';
import Krcon from '../models/KRConModel.js';

class SiteController {
    //[GET] /home
    async index(req, res, next) {
        try {
            const objectives = await Objective.find({});
            res.render('home', {
                courses: multipleMongooseToObject(objectives),
            });
            console.log(objectives.length ? objectives : 'No objectives found');
        } catch (err) {
            console.error(`Error in fetching objectives: ${err.message}`);
            next(err);
        }
    }

    //[GET] /search/:id
    async search(req, res, next) {
        const id = req.params.id; // Example: "O-2024.10.3"
        try {
            // Step 1: Find the Objective by its ID
            const objective = await Objective.findOne({ id }); // Assuming the Objective has an 'id' field
            
            if (!objective) {
                console.log(`Objective not found for ID: ${id}`);
                return res.render('news', { 
                    krList: [], 
                    message: `No Objective found for the given ID: ${id}` 
                });
            }

            // Step 2: Find KRs where OId matches the Objective's _id
            const krList = await Kr.find({ OId: objective._id });

            // Log the number of KRs found and the KRs themselves
            console.log(`Found ${krList.length} KRs for Objective ID: ${objective._id}`);
            console.log(krList);

            // Step 3: Handle no KRs found
            if (!krList.length) {
                console.log(`No KR found for Objective ID: ${objective._id}`);
                return res.render('news', { 
                    krList: [], 
                    message: 'No KR found for the given Objective.' 
                });
            }

            // Step 4: Map KRs to objects if necessary and render
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
            // Step 1: Find the Objective by its ID
            const objective = await Kr.findOne({ id }); // Assuming the Objective has an 'id' field
            
            if (!objective) {
                console.log(`Objective not found for ID: ${id}`);
                return res.render('news', { 
                    krList: [], 
                    message: `No Objective found for the given ID: ${id}` 
                });
            }

            // Step 2: Find KRs where OId matches the Objective's _id
            const krList = await Krcon.find({ KrId: objective._id });

            // Log the number of KRs found and the KRs themselves
            console.log(`Found ${krList.length} KRs for Objective ID: ${objective._id}`);
            console.log(krList);

            // Step 3: Handle no KRs found
            if (!krList.length) {
                console.log(`No KR found for Objective ID: ${objective._id}`);
                return res.render('news', { 
                    krList: [], 
                    message: 'No KR found for the given Objective.' 
                });
            }

            // Step 4: Map KRs to objects if necessary and render
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

export default new SiteController();


// import { multipleMongooseToObject } from '../util/mongoose.js';
// import Objective from '../models/ObjectiveModel.js';
// import Kr from '../models/KRModel.js';
// import Krcon from '../models/KRConModel.js';
// import createSignedEmbedURL from '../metabaseHelper.js';

// // Cấu hình Metabase
// const baseUrl = "http://localhost:3000";
// const secretKey = "your-secret-key";

// class SiteController {
//     async index(req, res, next) {
//         try {
//             const objectives = await Objective.find({});
//             const questionId = 1;
//             const embedUrl = createSignedEmbedURL(questionId, baseUrl, secretKey);

//             res.render('home', {
//                 courses: multipleMongooseToObject(objectives),
//                 embedUrl,
//             });
//         } catch (err) {
//             console.error(`Error in fetching objectives: ${err.message}`);
//             next(err);
//         }
//     }

//     async search(req, res, next) {
//         const id = req.params.id;
//         try {
//             const { objective, krList } = await findObjectivesAndKRs(Objective, 'OId', '_id', id);

//             if (!objective) {
//                 return res.render('news', { krList: [], message: `No Objective found for ID: ${id}` });
//             }

//             res.render('news', { courses: krList });
//         } catch (err) {
//             console.error(`Error in search: ${err.message}`);
//             next(err);
//         }
//     }

//     async searchcon(req, res, next) {
//         const id = req.params.id;
//         try {
//             const { objective, krList } = await findObjectivesAndKRs(Kr, 'KrId', '_id', id);

//             if (!objective) {
//                 return res.render('krcon', { krList: [], message: `No KRCon found for ID: ${id}` });
//             }

//             res.render('krcon', { courses: krList });
//         } catch (err) {
//             console.error(`Error in searchcon: ${err.message}`);
//             next(err);
//         }
//     }
// }

// const findObjectivesAndKRs = async (model, filterField, idField, id) => {
//     const objective = await model.findOne({ idField: id });
//     if (!objective) return { objective: null, krList: [] };

//     const krList = await Kr.find({ [filterField]: objective._id }).lean();
//     return { objective, krList };
// };

// export default new SiteController();

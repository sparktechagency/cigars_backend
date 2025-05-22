/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// types/express.d.ts or a similar file in your project
declare namespace Express {
    export interface Request {
        files?: {
            product_image?: File[]; // Add more fields as needed, e.g. category_image, profile_image
            // Add other fields you might expect to receive
            profile_image?: File[];
            course_banner?: File[];
            banner?: File[];
            class_banner?: File[];
            category_image?: File[];
        };
    }
}

import {Router} from 'express';

/**
 * @param {Router} router
 */
const router = Router();

export default function web() {
    router.get("/", router.controller("home.getIndex"));
    return router;
}
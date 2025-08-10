import expressRouterGroup from '#app/systems/router_group';
import autoRouter from '#app/systems/router_auto';
import web from "#routers/web";
import { auto_routing } from '#app/configs/app';
import { applyPrefixMiddleware } from '#app/systems/middlewares';

export default function(app) {
    app.use(applyPrefixMiddleware());
    
    if(auto_routing) { app.use(autoRouter()) }

    app.use(expressRouterGroup());
    app.use(web());
}
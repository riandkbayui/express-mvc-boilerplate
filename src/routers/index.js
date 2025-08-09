import expressRouterGroup from '#libraries/express_router_group';
import web from "#routers/web";

export default function(app) {
    app.use(expressRouterGroup());
    app.use(web());
}
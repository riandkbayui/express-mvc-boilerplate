import express from 'express';
import {create as _hbs} from 'express-handlebars';
import formData from 'express-form-data';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import os from 'os';
import boot from '#systems/bootstrap';
import configApp from '#configs/app';
import routers from '#routers/index';
import hbsHelpers from '#systems/handlebars';
import hbsViewSys from '#systems/view';

async function bootstrap() {

    const app = express();
    app.use(boot());
    app.use(hbsViewSys());
    
    routers(app);

    const hbs = _hbs({
        defaultLayout: false,
        extname: ".hbs",
        helpers: hbsHelpers,
        layoutsDir: path.join(process.cwd(), 'src', 'views', 'layouts'),
        partialsDir: path.join(process.cwd(), 'src', 'views', 'partials'),
    });

    app.use(formData.parse({
        uploadDir: os.tmpdir(),
        autoClean: true
    }));

    app.use(formData.format());
    app.use(formData.stream());
    app.use(cors());
    app.use(cookieParser());
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.set('view engine', 'hbs');
    app.engine('hbs', hbs.engine);
    app.set('views', path.join(process.cwd(), 'src', 'views'));

    app.listen(configApp.port, function(){
        console.log(`Listen at port: ${configApp.port}`)
    });
}

bootstrap().catch(console.error);
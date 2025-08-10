export default function init({req, res, next}) {
    console.log("init mw");
    next();
}
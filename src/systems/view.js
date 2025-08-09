export default function view() {

    return (req, res, next) => {
        res.renderView = (path, data={}) => {
            let view_params = {
                layout: "main"
            }

            if(data) {
                view_params = Object.assign(view_params, data);
            }

            return res.render(path, view_params);
        }

        res.renderAuth = (path, data={}) => {
            let view_params = {
                layout: "auth"
            }

            if(data) {
                view_params = Object.assign(view_params, data);
            }

            return res.render(path, view_params);
        }

        return next(); 
    }
}
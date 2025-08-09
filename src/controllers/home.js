export async function getIndex({req, res}) {
	return res.renderView('index');
}
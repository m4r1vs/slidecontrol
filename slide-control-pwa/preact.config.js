export default function (config, env, helpers) {

	const postcssLoader = helpers.getLoadersByName(config, 'postcss-loader');
	postcssLoader.forEach(({ loader }) => delete loader.options);

}
const path = require('path');
let webpack = require('webpack');
const Timestamp = new Date().getTime();
const name = 'vue-ts';

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // 基本路径
    publicPath: `/${name}`,
    // 输出文件目录
    outputDir: name,
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // use the full build with in-browser compiler
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    //compiler: true,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config.resolve.alias.set("vue$", "vue/dist/vue.common.js");
        config.resolve.alias.set("@", resolve("src"));
        config.resolve.alias.set("#p", resolve("public"));
        config.set('name', name);
        config
            .plugin('html')
            .tap(args => {
                args[0].title = name;
                args[0].iconfont = `/iconfont/iconfont.css?v=${new Date().getTime()}`;
                return args
            });
    },
    configureWebpack: {
        // webpack 配置
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/[name].${Timestamp}.js`,
            chunkFilename: `js/[name].${Timestamp}.js`
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    //vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: false,
        // 开启 CSS source maps
        sourceMap: true,
        // css预设器配置项
        loaderOptions: {

        },
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    //dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        proxy: {
            '/wzFinance/': { // 测试环境(外网代理)
                target: "http://172.17.1.106",
                changeOrigin: true,
            },
        }, // 设置代理

        //port: 8080,
        before: app => {},
    },
    // 第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, "./src/assets/less/params.less")
            ]
        }
    }
};
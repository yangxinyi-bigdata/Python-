const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'preload.js',
      builderOptions: {
        // 配置 Electron Builder 选项
        extraResources: [
          {
            from: 'app',       // 源文件夹
            to: 'app',         // 目标文件夹（打包后的位置）
            filter: ['**/*']     // 包含所有文件
          }
        ],
        // 可选：如果需要将 Flask 文件夹放在特定路径下，例如资源目录，可以调整 `to` 的路径
        // extraResources: [
        //   {
        //     from: 'flask',
        //     to: 'resources/flask',
        //     filter: ['**/*']
        //   }
        // ]
      }
    }
  }, 
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    },
  }
})
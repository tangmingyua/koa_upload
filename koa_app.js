const Router = require('koa-router');
const router = new Router();
const serve = require("koa-static");
const Koa = require('koa')
const formidable = require('koa-formidable'); // 图片处理
const fs = require('fs'); // 图片路径
const path = require('path'); // 图片路径
const app = new Koa()
app.use(serve(__dirname))  // 设置静态文件

// 新建文件
let mkdirs = (dirname, callback)=> {
    fs.exists(dirname, function(exists) {
        if (exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirname), function() {
                fs.mkdir(dirname, callback);
            });
        }
    });
};

router.post('/upload/image',async function (ctx, next) {debugger
    let form = formidable.parse(ctx.request);
     const formImage = function() {
        return new Promise((resolve, reject) => {
            form((opt, {fields, files})=> {
                let url = fields.url;
                let articleId = fields.articleId;
                let filename = files.file.name;
                let uploadDir = 'public/upload/';
                let avatarName = filename;
                mkdirs('public/upload', function() {
                    fs.renameSync(files.file.path, uploadDir + avatarName);
                    resolve( '/' + uploadDir + avatarName)
                })
            })
        })
    }
    let url = await formImage();
    console.log(url);
    ctx.body = {flag: '1',msg:'',data: url}
});

app.use(router.routes())
    .use(router.allowedMethods());
app.listen(3000, () => {
    console.log('[demo] upload-pic-async is starting at port 3000')
})

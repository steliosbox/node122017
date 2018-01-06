const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const koaBody = require('koa-body');

const uploadDir = path.join(process.cwd(), 'public_html/img/work');
const koaBodyObj = {
  multipart: true,
  formidable: {
    uploadDir: uploadDir
  }
};

// подключаем базу - "lowdb"
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// проверяем, существует ли папка "uploads"
// создаем в случае отсутствие
(async (dir) => {
  const fs = require('fs');
  const uploadDir = path.join(dir);
  if (!await fs.existsSync(uploadDir)) {
    await fs.mkdirSync(uploadDir);
  }
})(uploadDir);

router
  // обрабатываем "GET" запрос
  // ///////////////////////////////////////////////////////////////
  .get('/', async (ctx, next) => {
    // находим все работы в базе - "lowdb"
    const projects = db
      .get('projects')
      .value();
    // отдаем пользователю страницы работ
    ctx.render('my-work', { projects: projects });
  })
  // обрабатываем "POST" запрос
  // ///////////////////////////////////////////////////////////////
  .post('/', koaBody(koaBodyObj), async (ctx, next) => {
    const { projectName, projectUrl, text } = ctx.request.body.fields;
    const { size, path: fileDir, name, type } = ctx.request.body.files.file;

    // проверяем, заполнены ли все поля
    if (!projectName || !projectUrl || !text || size <= 0) {
      // сообщаем пользователю о необходимости заполнить все поля
      ctx.body = { mes: 'Заполните все поля', status: 'Error' };
      // удаляем временную картинуку
      fs.unlink(fileDir, err => {
        // в случае ошибки при удаление временной картинку
        // выводим сообщение в консоль для админа и продолжаем работу
        if (err) console.log(err);
      });
      // прерываем выполнение дольшейшего кода
      return false;
    }

    // определяем разширение файла
    const ext = path.extname(name);
    // конкатенируем текущую дату в миллисекунды с расширением файла
    // для переименовании временного файла
    const date = Date.now().toString() + ext;

    try {
      // переименовываем картинку на текущую дату в миллисекундах
      // используется синхронный метод, так как с асинхронным
      // возникли проблемы с отправкой сообщения о ошибке пользователю
      await fs.renameSync(fileDir, path.join(uploadDir, date));
      // сохраняем проект в базу - "lowdb"
      await db.get('projects')
        .push({
          'timestamp': Date.now(),
          'name': projectName,
          'url': projectUrl,
          'description': text,
          'image': date
        })
        .write();
      // сообщаем пользователю о успешной загрузке проекта
      ctx.body = { mes: 'Проект успешно загружен', status: 'OK' };
    } catch (err) {
      // сообщаем пользователю об ошибке
      ctx.body = { mes: err.message, status: 'Error' };
      // удаляем временную картинуку
      fs.unlink(fileDir, err => {
        // в случае ошибки при удаление временной картинку
        // выводим сообщение в консоль для админа и продолжаем работу
        if (err) console.log(err);
      });
    }
  });

module.exports = router;

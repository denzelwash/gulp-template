:v:
:metal:
:star:
:hankey:
:hankey:
:hankey:
:hankey:
:hankey:
:star:
:metal:
:v:
# Gulp стартовый шаблон
Сборщик для многостраничных сайтов. Нет как обычно отдельных папок src и dist, все в одном каталоге(так удобнее после прикрутки бэка и при поддержке). Все файлы в assets, в корень летят только html файлы.
<br>
<br>

# Возможности:

**css**
1. scss
2. sourcemaps
3. очистка от не используемых классов
4. автопрефиксер
5. минификация

Все не используемые классы из libs.scss и main.scss удаляются. сustom.css для стилей без запуска сборки и для тех которые добавляет js.

----------------

**js**
1. минификация списка либ прописанных в buildJsLibs

----------------

**html**
1. pug
2. beautify

----------------

**img**
1. сжатие png,jpg
2. webp
3. svg sprite

----------------
<br>
Для запуска команда gulp watch, смотрит за assets/ и /*.html
<br>
<br>
Отдельные команды:

+ pug 
+ styles
+ jsLibs
+ images
+ imagesWebp
+ sprite

:hand:
:hand:
:hand:
:hand:
:hand:
:hand:
:hand:
:hand:
:hand:
:hand:

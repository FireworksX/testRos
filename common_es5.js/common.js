'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  Лучше читать с конца

var Nodes = function () {
    function Nodes() {
        _classCallCheck(this, Nodes);

        this.parent = {};
        this.deletedItems = []; //  Хранит удалённые элементы для того чтобы их востановить
    }

    _createClass(Nodes, [{
        key: 'render',
        value: function render(array, isDel) {
            this.parent = document.getElementsByClassName('elements__list'); // Получаем родителя и определяем его глобально относительно класса
            if (isDel) {
                /*
                Если true, то проходим по массиву и востанавливаем удалённые элементы
                 */
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.deletedItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        this.parent[0].appendChild(item);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                this.deletedItems = [];
                return;
            }
            if (typeof array !== 'undefined') {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var key = _step2.value;

                        /*
                        Проходим по массиву и в родителя импортируем результат выполнения метода this._getElement
                        которая возвращает DOM элемент
                         */
                        this.parent[0].appendChild(this._getElement(key));
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else {
                return new Error('Type error');
            }
        }
    }, {
        key: '_getElement',
        value: function _getElement(key) {
            var _this = this;

            /*
            "Конструктор" для построения элемента
             */

            var element = document.createElement('li');
            element.className = 'elements__item';

            var img = document.createElement('IMG');
            img.src = 'http://placehold.it/500x300';

            var head = document.createElement('div');
            head.className = 'elements__head';
            head.textContent = key.name;

            var overlay = document.createElement('div');
            overlay.className = 'elements__overlay';

            var title = document.createElement('div');
            title.className = 'elements__title';
            title.textContent = key.name;

            var desc = document.createElement('div');
            desc.className = 'elements__desc';
            desc.textContent = key.text;

            var remove = document.createElement('div');
            remove.className = 'elements__remove';
            remove.textContent = 'delete';

            element.appendChild(img);
            element.appendChild(head);

            overlay.appendChild(title);
            overlay.appendChild(desc);
            overlay.appendChild(remove);

            element.appendChild(overlay);

            remove.addEventListener('click', function () {
                /*
                Вешаем обработчик на клик кнопки delete
                 */
                _this.deletedItems.push(element); //Пушим в глобальный массив
                _this.parent[0].removeChild(element); //Удаляем элемент
            });

            return element; //  Возваращаем собранный элемент
        }
    }, {
        key: 'getData',
        value: function getData(url, options) {
            return new Promise(function (resolve, reject) {
                var allItems = [];
                var xhr = new XMLHttpRequest();

                xhr.open('GET', url, true);

                xhr.send();

                xhr.onreadystatechange = function () {

                    if (xhr.readyState != 4) return;
                    if (xhr.status != 200) {
                        reject(xhr.status);
                    } else {
                        allItems = JSON.parse(xhr.response);

                        if (typeof options !== 'undefined') {
                            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') reject('Type of options will be need set as object.');

                            var start = options.start,
                                finish = options.finish;


                            var response = [];
                            for (var i = start; i < finish; i++) {
                                response.push(allItems[0].data[i]);
                            }
                            resolve({ response: response, allItems: allItems });
                        }
                        resolve(allItems);
                    }
                };
            });
        }
    }]);

    return Nodes;
}();

window.addEventListener('load', function () {

    var start = 0; //Start и Finish для выборки конкретных элементов
    var finish = 4;
    var count = void 0; //Хранит количество загруженных элементов

    var nodes = new Nodes(); //Инициализируем класс
    /*
    Вызываем метод класса getData который принимает 2 аргумента
    1- URL куда будет отправлен запрос
    2- Объект с параметрами start, finish для выборки нужных элементов
    Если второй аргумент не передан, то возвращает полный список всех элементов
    Если переданы оба парметра, то вернёт объект со свойствами
        response - выборка из 4-х элементов
        allItems - все элементы
    !Метод асинхронный, возвращает промис
    */
    nodes.getData('http://81.177.101.213/ajax/test.json', { start: start, finish: finish }).then(function (resolve) {
        /*
        Вызываем метод render, который принимает 2 аргумента, но в данном случае используется 1
        1- Массив с нужными ключами
         */
        nodes.render(resolve.response);
        count = resolve.allItems[0].data.length; //Присваиваем количество элементов массива для отлова ошибок
        start += 4; //Для выборки других элементов
        finish += 4;
    }, function (reject) {
        console.log(reject);
    });

    var button = document.getElementsByClassName('elements__more');
    button[0].addEventListener('click', function () {
        /*
        При клике на кнопку LOAD MORE вызывается метод getData, тут всё уже знакомо
         */
        nodes.getData('http://81.177.101.213/ajax/test.json', { start: start, finish: finish }).then(function (resolve) {
            start += 4;
            finish += 4;
            if (finish > count) {
                //Проверяем чтобы не загружали больше чем можем
                finish = count;
            }
            nodes.render(resolve.response);
        }, function (reject) {
            console.log(reject);
        });
    });

    //  Позволил себе добавить немного функционала
    //  При клике востанавливаются элементы которые были удалены кнопкой "delete"
    button[1].addEventListener('click', function () {
        /*
        Вызываем метод render класса nodes и используем второй аргумент
        если он равен true, то меняется алгоритм добавления элементов
         */
        nodes.render(nodes.deletedItems, true);
    });
});
/*
    Стили отличаются т.к. нет исходника, но думаю это не столь важно, акцент на JS (наверное)
 */
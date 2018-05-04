//  Лучше читать с конца

class Nodes {
    constructor(){
        this.parent = {};
        this.deletedItems = []; //  Хранит удалённые элементы для того чтобы их востановить
    }

    render(array, isDel) {
        let list = document.createElement('ul');
        list.className = 'elements__list';
        this.parent = document.getElementsByClassName('wrapper'); // Получаем родителя и определяем его глобально относительно класса
        if(isDel){
            /*
            Если true, то проходим по массиву и востанавливаем удалённые элементы
             */
            for(let item of this.deletedItems){
                item.parent.appendChild(item.element);
            }
            this.deletedItems = [];
            return;
        }
        if(typeof array !== 'undefined'){
            for(let key of array){
                /*
                Проходим по массиву и в родителя импортируем результат выполнения метода this._getElement
                которая возвращает DOM элемент
                 */
                // let firstChild = this.parent[0].firstChild; //Находим первого реюёнка
                // if(firstChild === null){
                //     this.parent[0].appendChild(this._getElement(key)); //если его нет, то добавляем
                // }else{
                //     this.parent[0].insertBefore(this._getElement(key), firstChild); //если есть, то перед ним добавляем новый элемент
                // }
                list.appendChild(this._getElement(key));
            }
            let fChild = this.parent[0].firstChild;
            this.parent[0].insertBefore(list, fChild)
        }else{
            return new Error('Type error')
        }
    }

    _getElement(key) {
        /*
        "Конструктор" для построения элемента
         */

        let element = document.createElement('li');
        element.className = 'elements__item';

        let img = document.createElement('IMG');
        img.src = 'http://placehold.it/500x300';

        let head = document.createElement('div');
        head.className = 'elements__head';
        head.textContent = key.name;

        let overlay = document.createElement('div');
        overlay.className = 'elements__overlay';

        let title = document.createElement('div');
        title.className = 'elements__title';
        title.textContent = key.name;

        let desc = document.createElement('div');
        desc.className = 'elements__desc';
        desc.textContent = key.text;

        let remove = document.createElement('div');
        remove.className = 'elements__remove';
        remove.textContent = 'delete';

        element.appendChild(img);
        element.appendChild(head);

        overlay.appendChild(title);
        overlay.appendChild(desc);
        overlay.appendChild(remove);

        element.appendChild(overlay);

        remove.addEventListener('click', () => {
            /*
            Вешаем обработчик на клик кнопки delete
             */
            let parent = element.parentNode;
            this.deletedItems.push({parent, element}); //Пушим в глобальный массив
            parent.removeChild(element); //Удаляем элемент
        });

        return element; //  Возваращаем собранный элемент
    }

    getData(url, options) {
        return new Promise((resolve, reject) => {
            let allItems = [];
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);

            xhr.send();

            xhr.onreadystatechange = () => {

                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    reject(xhr.status);
                } else {
                    allItems = JSON.parse(xhr.response);

                    if(typeof options !== 'undefined'){
                        if(typeof options !== 'object') reject('Type of options will be need set as object.');

                        let { start, finish } = options;

                        let response = [];
                        for(let i = start; i < finish; i++){
                            response.push(allItems[0].data[i]);
                        }
                        resolve({response, allItems});
                    }
                    resolve(allItems);
                }

            };


        });
    };
}


window.addEventListener('load', () => {

    let start = 0;//Start и Finish для выборки конкретных элементов
    let finish = 4;
    let count; //Хранит количество загруженных элементов

    let nodes = new Nodes();//Инициализируем класс
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
    nodes.getData('http://81.177.101.213/ajax/test.json', {start, finish}).then((resolve) => {
        /*
        Вызываем метод render, который принимает 2 аргумента, но в данном случае используется 1
        1- Массив с нужными ключами
         */
        nodes.render(resolve.response);
        count = resolve.allItems[0].data.length; //Присваиваем количество элементов массива для отлова ошибок
        start += 4; //Для выборки других элементов
        finish += 4;
    }, (reject) => {
        console.log(reject);
    });

    let button = document.getElementsByClassName('elements__more');
    button[0].addEventListener('click', () => {
        /*
        При клике на кнопку LOAD MORE вызывается метод getData, тут всё уже знакомо
        !   При кажном клике отправляется запрос, это не хорошо, я это знаю, исправить это можно легко
         */
        nodes.getData('http://81.177.101.213/ajax/test.json', {start, finish}).then((resolve) => {
            start += 4;
            finish += 4;
            if(finish > count){ //Проверяем чтобы не загружали больше чем можем
                finish = count;
            }
            nodes.render(resolve.response);
        }, (reject) => {
            console.log(reject);
        });
    });

    //  Позволил себе добавить немного функционала
    //  При клике востанавливаются элементы которые были удалены кнопкой "delete"
    button[1].addEventListener('click', () => {
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
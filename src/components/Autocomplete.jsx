import React, { Component } from 'react';

import ListItems from './ListItems.jsx';

import './Style.css';

import './StyleFont.css';

class Autocomplete extends Component {

	constructor(props) {

        super(props);
		//Получение json и запись его в state
        var get_json = new XMLHttpRequest();

		get_json.open('GET', 'kladr.json', false); 

		get_json.send();

		if (get_json.status != 200) {
  			alert( get_json.status + ': ' + get_json.statusText ); 
		} else {
			get_json = JSON.parse(get_json.responseText);
		}
		
		var data_index = [];
		//Создание массива с индексами из первых букв
		for (var i = 0; i < get_json.length; i++) {

			if (typeof(data_index[get_json[i].City[0]])=="undefined") {

				data_index[get_json[i].City[0]] = [];
			}
			data_index[get_json[i].City[0]].push({City:get_json[i].City, Id:get_json[i].Id});
		}
		//запись его в state
		this.state = {
            data_index: data_index,
            data_rez: [],
            error:false
        };
        ////////////////////////////////////
	}
	//Метод для нахождения городов
	serchItems(event) {
		document.getElementsByClassName('bar')[0].style.display = 'none';

		var res = [];

		try {
			var textIndex = event.target.value[0].toUpperCase();
		} catch(e) {}
		//Экранирование специальных символов
		var textInput = event.target.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		
		if (typeof(this.state.data_index[textIndex]) == "undefined") {
			res = [];
		} else {

			var reg = new RegExp(textInput,"i");
			//Нахождение и запись совпадений
			for (var i = 0; i < this.state.data_index[textIndex].length; i++) {
				
			 	if (reg.test(this.state.data_index[textIndex][i].City)) {	
			 		res.push({City: this.state.data_index[textIndex][i].City.replace(reg, "<b>$&</b>"), Id: this.state.data_index[textIndex][i].Id})
			 	}
			}
		}
		
		var listClass = this.listClass;
		var clipperClass = document.getElementsByClassName('clipper')[0];

   		listClass.style.display = 'none';
		
		this.setState({error: false}); //Не найдено городов 
		this.setState({data_rez: res});//Массив найденных городов

		if (res.length<=0 ) {
			if (event.target.value.length>0) {
				res.push({City:'Не найдено', Id:1});
				this.setState({error: true}); 
			} else {
				this.setState({error: false}); 
				listClass.style.display = 'none';
			}
			listClass.style.display = 'none';
			
			this.setState({data_rez: res}); 	
		}
	}
	//Метод для перемещения стрелками между элементами списка
	keySelect(event) {
	    let items = document.getElementsByClassName('item');
	    let scroll = document.getElementsByClassName('scroller')[0];
	   	let selectedPosX = 0;
		let selectedPosY = 0;
		
		if (event.which == 40 && i < items.length-1 ) {
				this.removeActive();
	     		items[++i].classList.add('active');
		} else {
		        if (event.which == 38 && ( i > 0 && i < items.length) ) {
		            this.removeActive();
		            items[--i].classList.add('active');
		        }
		    }
		try {
			selectedPosY += items[i].offsetTop;
			scroll.scrollTop = selectedPosY-55;
		} catch(e) {}	
	}
	//Смешения списка городов вверх
	bottomOffset(event) {

	    let listClass = this.listClass;
		let bottomOffset = document.documentElement.clientHeight - (this.inputClass.offsetTop - document.body.scrollTop) - this.inputClass.offsetHeight;
		let topOffset = this.inputClass.offsetTop - document.body.scrollTop		
		let active = this.yesActiveClass;

		active.classList.remove('notActive');

		listClass.style.display = 'none';

		let serch = document.getElementsByClassName('serch')[0]

		if (bottomOffset < 200) {

			if (topOffset < 450) {
				serch.style.maxHeight = ( topOffset - 55 )+ 'px';
				serch.style.minHeight = '150px';
			} else {
				serch.style.maxHeight = '400px';
			}
			try {
				listClass.classList.add('selectTop');
				if (this.state.error) {
					serch.style.minHeight = '0px';
					document.getElementsByClassName('bar')[0].style.display = 'none';
				}
			} catch(e) {} 
		} else {
			if (bottomOffset < 450) {
				serch.style.maxHeight = ( bottomOffset - 55 )+ 'px';
				serch.style.minHeight = '150px';
				if (this.state.error) {
					serch.style.minHeight = '0px';
					document.getElementsByClassName('bar')[0].style.display = 'none';
				}
			} else {
				serch.style.maxHeight = '400px';
			}
			try {
				listClass.classList.remove('selectTop');
			} catch(e) {}
		}
		try{		
			if (event.target.value.length>0){
				listClass.style.display = 'block';
			}
			if (event.which == 13){
				event.target.blur();
			}
		} catch(e) {}
	}
	//Потеря фокуса 
	blurInput(event) {
		var active = this.yesActiveClass;//Выберите значение из списка.

		let listClass =	this.listClass;//Список

		var activeItem = document.getElementsByClassName('active')[0];	

		active.classList.remove('notActive');

		if (this.state.error) {//если элементы не найдены

			event.target.classList.add('inputError');

			active.classList.add('notActive');

		} else {
			event.target.classList.remove('inputError');

			active.classList.remove('notActive');
			
			if (typeof activeItem === 'object') {//Если активный элеменнт есть выводим его
				event.target.value = document.getElementsByClassName('active')[0].innerText;
			} else {
				if (event.target.value.length > 0){
					active.classList.add('notActive');	
				}
			}
		}
		listClass.style.display = 'none';//Скрываем список 
	}
	//Метод для удаления активных элементов 
	removeActive(){
		let items = document.getElementsByClassName('active');
		for (let i = items.length - 1; i >= 0; i--) {
			items[i].classList.remove('active');
		}
	}
	//Выполняется после render 
	componentDidMount(){
		
		let items = document.getElementsByClassName('item');
		this.listClass.onmouseover = (e)=>{//Выделение элементов при наведении
			if (e.target.classList.contains('item')){
				this.removeActive();//Удаление всех активных элементов 
				e.target.classList.add('active');//Выделение элемента
				document.body.style.overflow = 'hidden';
			}   
		}
		this.listClass.onmouseout = (e)=>{
			if (e.target.classList.contains('item')){
				document.body.style.overflow = 'visible';
			}   
		}
		this.bottomOffset();
	}

	componentDidUpdate(){
		let items = document.getElementsByClassName('item');
		this.removeActive();
		try {
			items[0].classList.add('active');//выделение первого элемента при поиске 
		} catch(e) {}
		return true;
	}

    render() {
		i = 0;
        return (
        	<div>
        		<div className="left">Город</div>
				<div className="right">
					<input	type='text' 
						className="in_serch"
						placeholder="Введите или выберите из списка" 
						onKeyDown={this.keySelect.bind(this)}
						onKeyUp={this.bottomOffset.bind(this)}
						onChange={this.serchItems.bind(this)}
						onBlur={this.blurInput.bind(this)}
						ref={(input) => this.inputClass = input}
						/>
					<div className="main">
					<div className="list" ref={(div) => this.listClass = div}>
						<ListItems Data={this.state.data_rez} Length={this.state.data_rez.length} Error={this.state.error} />
					</div>
					<div className = "yesActive" ref={(div) => this.yesActiveClass = div}>
						Выберите значение из списка.
					</div>
					
					</div>
				</div>
			</div>	
        );
    }
}
var i = 0;//индекс выделеного элемента 
export default Autocomplete;
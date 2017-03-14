import React, { Component } from 'react';

import Baron from './BaronScroll.js';

import './Style.css';

import './StyleFont.css';

class ListItems extends Component {

	scroll(event) {
		document.getElementsByClassName('bar')[0].style.display = 'block';
	}

	render() {

	 	if (this.props.Length>0 && !this.props.Error) {
	 		//Количество найденных и показанных элементов 
	 		let countItrms = Math.round(parseInt(this.serchClass.style.maxHeight)/30);
    		var length = "Показано "+(this.props.Length<countItrms?this.props.Length:countItrms)+" из " +this.props.Length+ " Найденных городов. Уточните запрос или прокрутите скролл";
    		var length1 = "length";
    	} else {
    		var error = "";
    		var length = "";
    		var length1 = "";
    	}
    	 var serchStyle = {
            maxHeight: '400px'
        };
	 	
	 	return (
	 		<div>
	 			<Baron  onScroll={this.scroll.bind(this)}
	            		clipperCls="clipper"
			            scrollerCls="scroller"
			            trackCls="track"
			            barCls="bar" 
			            barOnCls="baron" >
				<div className="serch" style={serchStyle} id="div" ref={(div) => this.serchClass = div}> 
					<ul className ={error} className ="result">{this.props.Data.map(item => <Items key={item.Id} City={item.City}/>)}</ul>		
				</div> 
				</Baron>
				<div className ={length1} ref={(div) => this.lengthClass = div}>
					{length}
				</div>
			</div>
	 	);
	}
}

class Items extends Component{
	render() {
	 	return (
	 		<li className="item" dangerouslySetInnerHTML={{__html: this.props.City}}></li>
	 	);
	}
}
export default ListItems;
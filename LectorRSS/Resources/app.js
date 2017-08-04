//link del RSS de la prensa
var url = "http://www.prensa.com/rss/section/1000400/";
//conexion con la base de datos, su instalacion y open
Ti.Database.install('Favoritos.sqlite', 'misNoticias');
var data = Ti.Database.open('misNoticias');
//httpClient para la lectura y parseo del xml que se obtiene atravez del RSS de la prensa
var client = Ti.Network.createHTTPClient({
	onload: function(e){
		//parseo del xml
		var xml = this.responseXML;
		var channel = xml.documentElement.getElementsByTagName("channel");
		var items = xml.documentElement.getElementsByTagName("item");
		
		//creacion del tanGroup
		var tabGroup = Ti.UI.createTabGroup({title:'Noticias', Color:'#00695c'});

		/**
		 * creacion de la ventana NOTICIAS en su pestaña
		 * esta tiene httpClient del RSS de la Prensa mustra las noticias de "TODOS" en cards
		 */
		var ventanaNoticias = Ti.UI.createWindow({
			backgroundColor: '#9e9e9e'
		});
		//funcion que crea un Card y su contenido
		function agregarCard(index){
			//ubicacion de la informacion necesaria del xml para su uso
			var title = items.item(i).getElementsByTagName("title").item(0).textContent;
			var link = items.item(i).getElementsByTagName("link").item(0).textContent;
			
			var tarjeta = Ti.UI.Android.createCardView({
				contendPadding: 30,
				cardCornerRadius: 30,
				cardUseCompatPadding: true,
				layout: 'vertical',
				top: 20
			});
			//View que muestra el titulo de la noticia y su link para leerla completa
			var viewDexcription = Ti.UI.createView({
				backgroudColor: '#424242',
				width: '300dp',
				height: '150dp'
			});
			/*
			 * la variable liga es un texto q se crea atravez del titulom de la noticia y un String 'Leer mas'
			 * con este ultimo utilizo un AttributedString del tipo ATTRIBUTE_LINK para crear un acceso a la liga
			 * de la noticia y sea mas facil para el usuario
			 */
			var liga = title+"\n\nLeer mas";
			var attr = Ti.UI.createAttributedString({
			    text: liga,
			    attributes: [
			        {
			            type: Titanium.UI.ATTRIBUTE_LINK,
			            value: link,
			            range: [liga.indexOf('Leer mas'), ('Leer mas').length]
			        }  
			    ]
			});
			var descripcion = Ti.UI.createLabel({
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				color: 'white',
				attributedString: attr
			});
			/*pequeña barra abajo del card que tiene el boton favoritos con un caracteristico boton
			 *su funcion es la de agregar la informacion de la noticia a la database para que el usuario
			 * la pueda consultar cuando lo desee.
			 * el boton se oculta para evitar que el usuario ingrese barias veces la misma noticia 
			 */
			var viewFavoritos = Ti.UI.createView({
				backgroundColor: '#26a69a',
				width: '300dp',
				height: '40dp'
			});
			var buttonFavorito = Titanium.UI.createButton({
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			   	image: '/img/star2.png',
			   	width: 45,
			   	height: 40
			});
			buttonFavorito.addEventListener('click',function(e){
				var dialog = Ti.UI.createAlertDialog({
				    message: 'Se Agrego la Noticia a mis Favoritos',
				    ok: 'Ok',
				    title: 'Muy Bien'
				});
			    data.execute('INSERT INTO misFavoritos (titulo, link) VALUES (?, ?)', title,link);
			    buttonFavorito.setVisible(false);
			   	dialog.show();
			});
			
			viewDexcription.add(descripcion);
			viewFavoritos.add(buttonFavorito);
			tarjeta.add(viewDexcription);
			tarjeta.add(viewFavoritos);
			return tarjeta;
		}
		/*todo lo de la funcion pasada se agrega en un ScrollView por medio de un for que solo muestra las 10
		 * ultimas noticias del momento
		 */
		var scrollView = Ti.UI.createScrollView({
			layout: 'vertical'
		});
		for(i=0;i<10;i++){
			var miTarjeta = agregarCard(i);
			scrollView.add(miTarjeta);
		}
		
		ventanaNoticias.add(scrollView);
		var tabNoticias = Titanium.UI.createTab({window:ventanaNoticias, title:'TODO', backgroundColor:'#00897b'});
		
		/**
		 * creacion de la ventana MAS.. en su respectiva pestaña
		 * se crean distintos botones para el menu
		 */
		/*
		 * esta pestaña llamada Mas.. solo contiene un menu de categorias junto con un boton para acceder a favoritos
		 * cada boton tiene un color y un icono por individual; y para cada boton se utiliza un require() en su evento
		 * esto con la finalidad de abrir otra ventana en un archivo .js con su nombre correspondiente al boton
		 * salvo para favoritos que contiene una tabla (esto con el fin de ver todas las noticias de manera mas rapida)
		 * todas las demas vistas mantienen el mismo formato de un Card (ya mrncionado anterior mente), se decidio pasar
		 * ese codigo a otros archivos pues en uno solo era demaciado codigo y repetitivo.
		 */
		var ventanaMas = Ti.UI.createWindow({
			backgroundColor: '#9e9e9e',
		});
		//boton de fovoritos
		var botonFavoritos = Ti.UI.createButton({
			title: 'Favoritos',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/star3.png',
			backgroundColor: '#00e5ff'
		});
		botonFavoritos.addEventListener('click',function(e){
			var moduloFavoritos = require('Favoritos');
			moduloFavoritos.vtnFavoritos();
		});
		//boton de politica
		var botonPolitica = Ti.UI.createButton({
			title: 'Politica',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/auction.png',
			backgroundColor: '#ff5722'
		});
		botonPolitica.addEventListener('click',function(e){
			var moduloPolitica = require('Politica');
			moduloPolitica.vtnPolitica();
		});
		//boton economia
		var botonEconomia = Ti.UI.createButton({
			title: 'ECONOMIA',
			width: '200dp',
			height: '85dp',
			top: 10,
			image: '/img/bills.png',
			backgroundColor: '#33691e'
		});
		botonEconomia.addEventListener('click',function(e){
			var moduloEconomia = require('Economia');
			moduloEconomia.vtnEconomia();
		});
		//boton de deportes
		var botonDeportes = Ti.UI.createButton({
			title: 'Deportes',
			width: '200dp',
			height: '85dp',
			top: 10,
			image: '/img/soccer-ball-variant.png',
			backgroundColor: '#6d4c41'
		});
		botonDeportes.addEventListener('click',function(e){
			var moduloDeportes = require('Deportes');
			moduloDeportes.vtnDeportes();
		});
		//boton de Diversion
		var botonDiversion = Ti.UI.createButton({
			title: 'Diversion',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/gamepad.png',
			backgroundColor: '#aeea00'
		});
		botonDiversion.addEventListener('click',function(e){
			var moduloDiversion = require('Diversion');
			moduloDiversion.vtnDiversion();
		});
		//boton de Provincias
		var botonProvincia = Ti.UI.createButton({
			title: 'Provincia',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/family-of-three.png',
			backgroundColor: '#5e35b1'
		});
		botonProvincia.addEventListener('click',function(e){
			var moduloProvincia = require('Provincia');
			moduloProvincia.vtnProvincia();
		});
		//boton de Tecnologia
		var botonTecnologia = Ti.UI.createButton({
			title: 'Tecnologia',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/icon.png',
			backgroundColor: '#0097a7'
		});
		botonTecnologia.addEventListener('click',function(e){
			var moduloTecnologia = require('Tecnologia');
			moduloTecnologia.vtnTecnologia();
		});
		//boton de Salud y Ciencia
		var botonCiencia = Ti.UI.createButton({
			title: 'Salud y Ciencia',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/atom.png',
			backgroundColor: '#d81b60'
		});
		botonCiencia.addEventListener('click',function(e){
			var moduloCiencia = require('Ciencia');
			moduloCiencia.vtnCiencia();
		});
		//boton de Reseña Empresarial
		var botonEmpresarial = Ti.UI.createButton({
			title: 'Reseña Empresaria',
			width: '200dp',
			height: '85dp',
			top:10,
			image: '/img/bar-chart.png',
			backgroundColor: '#ffb300'
		});
		botonEmpresarial.addEventListener('click',function(e){
			var moduloEmpresarial = require('Empresarial');
			moduloEmpresarial.vtnEmpresarial();
		});
		
		
		var scrollButtoms = Ti.UI.createScrollView({
			layout: 'vertical'
		});
		
		scrollButtoms.add(botonFavoritos);
		scrollButtoms.add(botonPolitica);
		scrollButtoms.add(botonEconomia);
		scrollButtoms.add(botonDeportes);
		scrollButtoms.add(botonDiversion);
		scrollButtoms.add(botonProvincia);
		scrollButtoms.add(botonTecnologia);
		scrollButtoms.add(botonCiencia);
		scrollButtoms.add(botonEmpresarial);
		ventanaMas.add(scrollButtoms);
		var tabMas = Titanium.UI.createTab({window:ventanaMas, title:'Mas ..', backgroundColor:'#00897b'});
		
		tabGroup.addTab(tabNoticias);
		tabGroup.addTab(tabMas);
		
		tabGroup.open();
	},
	onerror: function(e){
		alert(e.error);
	},
	timeout: 10000
});
client.open("GET", url);
client.send();

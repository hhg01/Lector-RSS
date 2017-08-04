//exportacion de la funcion para el evento de su respectivo boton
exports.vtnEmpresarial = function() {
	//conexion con la base de datos
	Ti.Database.install('Favoritos.sqlite', 'misNoticias');
	var data = Ti.Database.open('misNoticias');
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		var xml = this.responseXML;
		var channel = xml.documentElement.getElementsByTagName("channel");
		var items = xml.documentElement.getElementsByTagName("item");

		var win = Ti.UI.createWindow({
			backgroundColor : '#9e9e9e',
			title : 'EMPRESARIAL'
		});
		function agregar(indice) {
			//ubicacion de la informacion necesaria del xml para su uso
			var title = items.item(i).getElementsByTagName("title").item(0).textContent;
			var link = items.item(i).getElementsByTagName("link").item(0).textContent;

			var tarjeta = Ti.UI.Android.createCardView({
				contendPadding : 20,
				cardCornerRadius : 10,
				cardUseCompatPadding : true,
				layout : 'vertical',
				top : 20
			});
			var viewDexcription = Ti.UI.createView({
				backgroudColor : '#424242',
				width : '300dp',
				height : '150dp'
			});
			/*
			 * la variable liga es un texto q se crea atravez del titulom de la noticia y un String 'Leer mas'
			 * con este ultimo utilizo un AttributedString del tipo ATTRIBUTE_LINK para crear un acceso a la liga
			 * de la noticia y sea mas facil para el usuario
			 */
			var liga = title + "\n\nLeer mas";
			var attr = Ti.UI.createAttributedString({
				text : liga,
				attributes : [{
					type : Titanium.UI.ATTRIBUTE_LINK,
					value : link,
					range : [liga.indexOf('Leer mas'), ('Leer mas').length]
				}]
			});
			var descripcion = Ti.UI.createLabel({
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				color : 'white',
				attributedString : attr
			});
			/*pequeña barra abajo del card que tiene el boton favoritos con un caracteristico boton
			 *su funcion es la de agregar la informacion de la noticia a la database para que el usuario
			 * la pueda consultar cuando lo desee.
			 * el boton se oculta para evitar que el usuario ingrese barias veces la misma noticia 
			 */
			var viewFavoritos = Ti.UI.createView({
				backgroundColor : '#ffb300',
				width : '300dp',
				height : '40dp'
			});
			var buttonFavorito = Titanium.UI.createButton({
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				image : '/img/star2.png',
				width : 45,
				height : 40
			});
			buttonFavorito.addEventListener('click', function(e) {
				var dialog = Ti.UI.createAlertDialog({
					message : 'Se Agrego la Noticia a mis Favoritos',
					ok : 'Ok',
					title : 'Muy Bien'
				});
				data.execute('INSERT INTO misFavoritos (titulo, link) VALUES (?, ?)', title, link);
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
			layout : 'vertical'
		});
		for ( i = 0; i < 10; i++) {
			var miTarjeta = agregar(i);
			scrollView.add(miTarjeta);
		}
		win.add(scrollView);
		win.open();
	};
	anXhr.onerror = function() {
		alert('The HTTP request failed');
	};

	// Send the request data.
	anXhr.open('GET', 'http://impresa.prensa.com/rss/section/1004300/');
	anXhr.send();

}; 
//exportacion de la funcion para el evento de su respectivo boton
exports.vtnFavoritos = function() {
	//conexion de la base de datos
	Ti.Database.install('Favoritos.sqlite', 'misNoticias');
	var db = Ti.Database.open('misNoticias');
	var query = db.execute('select * from misFavoritos');
	//arreglo donde guardo la informacion de la base de datos
	var arrayDatos = [];
	while (query.isValidRow()) {
		var title = query.fieldByName('titulo');
		var link = query.fieldByName('link');
		arrayDatos.push({
			title : title,
			link : link,
			color : 'black'
		});
		query.next();
	}
	//muestro el arreglo en una tabla esto mara mejor acceso a toda su lista de noticias
	var tablaDatos = Titanium.UI.createTableView({
		editable : false,
		borderColor : '#00e5ff',
		borderWidth : 3,
		borderRadius : 10,
		separatorColor : '#00e5ff'
	});
	tablaDatos.setData(arrayDatos);
	//evento de la tabla que al hacer click sobre el nombre deseado manda a la pagina de la noticia
	tablaDatos.addEventListener('click', function(e) {
		Ti.Platform.openURL(e.source.rowData.link);
	});
	//evento que al acer un longclick sobre la tabla te permite la opcion de borrar tu noticia favorita
	tablaDatos.addEventListener('longclick', function(e) {
		var titulo = e.source.rowData.title;
		var menuDialogo = Ti.UI.createOptionDialog({
			options : ['Eliminar', 'Cancelar'],
			destructive : 0,
			title : 'Eliminar Noticia'
		});
		menuDialogo.addEventListener('click', function(e){
			if(e.index === 0){
				alert('NOTICIA ELIMINADA\nEsta permanecera para que la consultes una ultima vez, en cuanto salgas ya no estará');
				db.execute('DELETE FROM misFavoritos WHERE titulo=?', titulo);
			}
		});
		menuDialogo.show();
	});

	var ventanaFavoritos = Ti.UI.createWindow({
		backgroundColor : '#9e9e9e',
		title : 'FAVORITOS'
	});

	ventanaFavoritos.add(tablaDatos);
	ventanaFavoritos.open();
};

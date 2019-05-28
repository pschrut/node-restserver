const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre de categoria es necesaria']
	},
	estado: {
		type: Boolean,
		default: true
	},
	usuario: {
		type: Schema.ObjectId, 
		ref: 'Usuario',
		required: true
	}
});

module.exports = mongoose.model('Categoria', categoriaSchema);
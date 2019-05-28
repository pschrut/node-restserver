const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// Mostrar todas las categorias

app.get('/categoria', verificaToken, (req, res) => {
	Categoria.find({ estado: true })
		.sort('descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, categorias) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			Categoria.countDocuments({ estado: true }, (err, conteo) => {
				res.json({
					ok: true,
					conteo,
					categorias
				});
			});
		});
});

app.get('/categoria/:id', verificaToken, (req, res) => {
	Categoria.findById(req.params.id, (err, categoriaDB) => {
		if (err) {
			res.status(500).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			categorias: categoriaDB
		});
	});

});

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
	let body = req.body;

	let categoria = new Categoria({
		nombre: body.nombre,
		usuario: req.usuario._id
	});

	categoria.save((err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
	let nombreCategoria = {
		nombre: req.body.nombre
	};

	Categoria.findByIdAndUpdate(req.params.id, nombreCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.status(200).json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
	Categoria.findByIdAndRemove(req.params.id, (err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El id no existe'
				}
			});
		}

		res.json({
			ok: true,
			message: 'Categoria borrada',
			categoria: categoriaDB
		});
	});
});

module.exports = app;
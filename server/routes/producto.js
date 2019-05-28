const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {
	let desde = Number(req.params.desde) || 0;
	let limite = Number(req.params.limite) || 5;

	Producto.find({ disponible: true })
		.populate('categoria', 'nombre')
		.populate('usuario', 'nombre email')
		.skip(desde)
		.limit(limite)
		.exec((err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			res.json({
				ok: true,
				productos: productoDB
			});
		});

});

app.get('/productos/:id', verificaToken, (req, res) => {
	let id = req.params.id;

	Producto.findById(id)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'nombre')
		.exec((err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			if (!productoDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'el id no existe'
					}
				});
			}

			res.json({
				ok: true,
				productos: productoDB
			});
		});
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })
		.populate('categoria', 'nombre')
		.exec((err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			res.json({
				ok: true,
				productos: productoDB
			})
		});
});

app.post('/productos', verificaToken, (req, res) => {
	let body = req.body;

	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id
	});

	producto.save((err, productoDB) => {
		if (err) {
			res.status(500).json({
				ok: false,
				err
			})
		}

		res.status(201).json({
			ok: true,
			producto: productoDB
		});
	});

});

app.put('/productos/:id', verificaToken, (req, res) => {
	let body = req.body;

	Producto.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }, (err, productoDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoDB) {
			return res.status(500).json({
				ok: false,
				err: {
					message: 'El id no existe'
				}
			});
		}

		res.json({
			ok: true,
			productoDB
		})
	});
});

app.delete('/productos/:id', verificaToken, (req, res) => {
	Producto.findByIdAndUpdate(req.params.id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'No existe el ID'
				}
			});
		}

		res.json({
			ok: true,
			productos: productoDB,
			message: 'El producto ha sido eliminado'
		});
	});
});

module.exports = app;
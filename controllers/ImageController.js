import Image from '../models/ImageModel.js';
import path from 'path';
import fs from 'fs';

export const getImages = async (req, res) => {
    try {
        const response = await Image.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getImageById = async (req, res) => {
    try {
        const response = await Image.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveImage = (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: 'No File Uploaded' });
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Image.create({ name: name, image: fileName, url: url });
            res.status(201).json({ msg: 'Image created successfully' });
        } catch (error) {
            console.log(error.message);
        }
    });
}

export const updateImage = async (req, res) => {
    const image = await Image.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!image) return res.status(404).json({ msg: 'No data found' });
    let fileName = "";
    if (req.files === null) {
        fileName = image.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', 'jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
        if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

        const filepath = `./public/images/${image.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });

        });
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    try {
        await Image.update({ name: name, image: fileName, url: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: 'Image updated successfully' })
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteImage = async (req, res) => {
    const image = await Image.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!image) return res.status(404).json({ msg: 'No data found' });
    try {
        const filepath = `./public/images/${image.image}`;
        fs.unlinkSync(filepath);
        await Image.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: 'Image deleted successfully' })
    } catch (error) {
        console.log(err.message);
    }
}

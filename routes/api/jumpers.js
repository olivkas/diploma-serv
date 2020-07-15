const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check, validationResult } = require('express-validator');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const Jumper = require('../../models/Jumper');

//@route    Post malfunctions
//@desc     Add malfunction
//@access   Public

router.post(
  '/',
  upload.array('file', 3),
  [
    check('shift', 'Shift is required').not().isEmpty(),
    check('fullName', 'FullName is required').not().isEmpty(),
    check('group', 'Group is required').not().isEmpty(),
    check('subgroup', 'Subgroup is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shift, fullName, group, subgroup, date, description } = req.body;
    console.log(req);

    // const imgNames = [{ path: req.files[0].path }];
    const imgNames = [];

    for (let i = 0; i < req.files.length; i++) {
      imgNames.unshift({ path: req.files[i].path });
    }

    const jumperFields = {};
    if (shift) jumperFields.shift = shift;
    if (fullName) jumperFields.fullName = fullName;
    if (group) jumperFields.group = group;
    if (subgroup) jumperFields.subgroup = subgroup;
    if (date) jumperFields.date = date;
    if (description) jumperFields.description = description;
    if (imgNames) jumperFields.imgNames = imgNames;

    try {
      const jumper = new Jumper(jumperFields);

      await jumper.save();
      res.json(jumper);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route    GET malfunctions
//@desc     GET all malfunctions
//@access   Public

router.get('/', async (req, res) => {
  try {
    const jumper = await Jumper.find();

    res.json(jumper);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    GET malfunctions/:id
//@desc     GET malfunction by ID
//@access   Public

router.get('/:id', async (req, res) => {
  try {
    const jumper = await Jumper.findById(req.params.id);

    if (!jumper) {
      return res.status(400).json({ msg: 'Jumper not found' });
    }

    res.json(jumper);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Jumper not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route    POST malfunctions/:id
//@desc     Update malfunction by ID
//@access   Public

router.post(
  '/:id',
  upload.array('file', 3),

  [
    check('shift', 'Shift is required').not().isEmpty(),
    check('fullName', 'FullName is required').not().isEmpty(),
    check('group', 'Group is required').not().isEmpty(),
    check('subgroup', 'Subgroup is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shift, fullName, group, subgroup, date, description } = req.body;
    console.log(req);

    // const imgNames = [{ path: req.files[0].path }];
    const imgNames = [];

    for (let i = 0; i < req.files.length; i++) {
      imgNames.unshift({ path: req.files[i].path });
    }

    //Build malfunction object
    const jumperFields = {};
    if (shift) jumperFields.shift = shift;
    if (fullName) jumperFields.fullName = fullName;
    if (group) jumperFields.group = group;
    if (subgroup) jumperFields.subgroup = subgroup;
    if (description) jumperFields.description = description;
    if (imgNames) jumperFields.imgNames = imgNames;

    try {
      let jumper = await Jumper.findById(req.params.id);

      if (jumper) {
        //Update
        jumper = await Jumper.findOneAndUpdate(
          { _id: req.params.id },
          { $set: jumperFields },
          { new: true }
        );

        return res.json(jumper);
      }
      console.log(req.params.id);
      res.json(jumper);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route    PUT malfunctions/:id/photo
//@desc     Add malfunction photo
//@access   Public
router.put(
  '/:id/photo',
  upload.single('path'),
  // [check('path', 'Path is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const { path } = req.body;
    const newPhoto = {
      path: req.file.path,
    };

    try {
      const malfunction = await Malfunction.findById(req.params.id);

      malfunction.imgNames.unshift(newPhoto);

      await malfunction.save();

      res.json(malfunction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route    PUT malfunctions/:id/photo
//@desc     Add malfunction photo
//@access   Public
router.put(
  '/:id/photo',
  upload.single('path'),
  // [check('path', 'Path is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const { path } = req.body;
    const newPhoto = {
      path: req.file.path,
    };

    try {
      const jumper = await Jumper.findById(req.params.id);

      jumper.imgNames.unshift(newPhoto);

      await jumper.save();

      res.json(jumper);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route    DELETE malfunction/:id/photo/pht_id
//@desc     Delete photo from malfunction
//@access   Public
router.delete('/:id/photo/:pht_id', async (req, res) => {
  try {
    const jumper = await Jumper.findById(req.params.id);

    //Get remove index
    const removeIndex = jumper.imgNames
      .map((item) => item.id)
      .indexOf(req.params.pht_id);

    jumper.imgNames.splice(removeIndex, 1);

    await jumper.save();

    res.json(jumper);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

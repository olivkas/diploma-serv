const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const Note = require('../../models/Note');

//@route    POST notes
//@desc     Create a note
//@access   Public

router.post(
  '/',
  [check('note', 'Note is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = new Note({
        note: req.body.note,
      });

      await note.save();

      res.json(note);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET notes
//@desc       Get current month
//@access   Public

// router.get('/', async (req, res) => {
//     try {
//       const note = await Note.find({ date: });
//       res.json(posts);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   });

module.exports = router;

const mongoose = require('mongoose');

// Schema validator for filter
const filterSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'filter must have a type'],
      minLength: [2, 'type length must be at least 2 characters'],
      maxLength: [15, 'type length can be up to 15 characters'],
      trim: true,
    },
    variant: {
      type: String,
      required: [true, 'filter must have a variant'],
      minLength: [2, 'variant length must be at least 2 characters'],
      maxLength: [15, 'variant length can be up to 15 characters'],
      trim: true,
    },
    icon: {
      type: [String],
      required: [false, 'filter may have an Icon name'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// UNIQUE INDEX
filterSchema.index({ type: 1, variant: 1 }, { unique: true });

/* MODEL MIDDLEWARE 
_____________________________________________________*/
// Document MiddleWare:
// manipulate the object before updating / saving / creating into db

// CREATE
filterSchema.pre('save', function (next) {
  console.log('DO -> BEFORE CREATING');

  this.productModified = Date.now();
  next();
});
filterSchema.post('save', function (doc, next) {
  console.log('DO -> AFTER CREATING');
  next();
});

// FIND
filterSchema.pre(['find', 'findOne'], function (next) {
  next();
});

filterSchema.post(['find', 'findOne'], function (doc, next) {
  next();
});

const Filter = mongoose.model('filter', filterSchema);
Filter.createIndexes();
module.exports = Filter;

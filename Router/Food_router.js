const express = require('express');
const router = express.Router();
const fs = require('fs'); // For handling file operations
const food_schema = require('../food_module/foodM'); // Mongoose schema for food items
const upload = require('../Multer/multer'); // Multer configuration for file uploads

// Upload new food item to server
router.post('/uploads', upload.single('image'), async (req, resp) => {
  const { name, desc, price } = req.body;

  if (!req.file) {
    return resp.status(404).json({ error: 'File not found' });
  }

  const image = req.file.filename;

  try {
    const newFood = new food_schema({
      name,
      image,
      desc,
      price,
    });

    await newFood.save();
    resp.json({ message: 'New product added successfully' });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: 'Error saving to database' });
  }
});

// Get all food items from the server
router.get('/', async (req, resp) => {
  try {
    const data = await food_schema.find();
    console.log('Data fetched');
    resp.status(200).json({ data });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single food item by ID
router.get('/single_Item/:id', async (req, resp) => {
  try {
    const id = req.params.id;
    const foodItem = await food_schema.findById(id);

    if (!foodItem) {
      return resp.status(404).json({ error: 'Food item not found' });
    }

    resp.status(200).json(foodItem);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: 'Internal server error' });
  }
});

// Update food item, including image
router.put('/:id', upload.single('image'), async (req, resp) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  try {
    const foodID = req.params.id;

    // Fetch the existing food item from the database
    const existingFood = await food_schema.findById(foodID);
    if (!existingFood) {
      return resp.status(404).json({ error: 'Item not found' });
    }

    // Update fields from the request body
    const { name, desc, price } = req.body;
    let updatedImagePath = existingFood.image; // Default to the current image

    // If a new image is uploaded, handle the image update
    if (req.file) {
      updatedImagePath = req.file.filename;

      // Delete the old image file from the server
      const oldImagePath = `upload/${existingFood.image}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Remove the old image file
      }
    }

    // Prepare the updated data
    const updatedFoodData = {
      name: name || existingFood.name, // Retain existing name if not updated
      desc: desc || existingFood.desc, // Retain existing desc if not updated
      price: price || existingFood.price, // Retain existing price if not updated
      image: updatedImagePath, // Use updated or existing image path
    };

    // Update the food item in the database
    const response = await food_schema.findByIdAndUpdate(foodID, updatedFoodData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated data
    });

    if (!response) {
      return resp.status(404).json({ error: 'Failed to update the item' });
    }

    console.log('Data updated successfully');
    resp.status(200).json({ message: 'Data updated successfully', response });
  } catch (error) {
    console.log('Error:', error);
    resp.status(500).json({ error: 'Internal server error' });
  }
});

// Delete food item
router.delete('/:id', async (req, resp) => {
  try {
    const deleteID = req.params.id;

    // Fetch the existing food item
    const existingFood = await food_schema.findById(deleteID);
    if (!existingFood) {
      return resp.status(404).json({ error: 'Food item not found' });
    }

    // Delete the image file from the server
    const imagePath = `upload/${existingFood.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the food item from the database
    const response = await food_schema.findByIdAndDelete(deleteID);
    if (!response) {
      return resp.status(404).json({ error: 'Failed to delete the item' });
    }

    console.log('Data deleted successfully');
    resp.status(200).json('Data deleted successfully');
  } catch (error) {
    console.log('Error:', error);
    resp.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

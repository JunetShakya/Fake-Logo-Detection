import os
import numpy as np
import pandas as pd
import cv2
import multiprocessing
from functools import partial
import uuid
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.applications import MobileNet
from tensorflow.keras.layers import Input, Flatten, LSTM, Dense, Dropout, BatchNormalization, concatenate
from tensorflow.keras.models import Model

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Utility function to preprocess image
def preprocess_image(img, target_size):
    """Resize and normalize the image."""
    img_resized = cv2.resize(img, target_size)
    img_normalized = img_resized / 255.0  # Normalize to [0, 1]
    return img_normalized

# Image Model
def create_image_model(input_shape):
    image_input = Input(shape=input_shape, name="image_input")
    base_model = MobileNet(include_top=False, weights='imagenet', input_shape=input_shape)
    
    # Unfreeze the last few layers of MobileNet for fine-tuning
    for layer in base_model.layers[-20:]:  # Adjust the number of layers to unfreeze
        layer.trainable = True
        
    image_features = Flatten()(base_model(image_input))
    return Model(inputs=image_input, outputs=image_features, name="ImageModel")


# Brand Model
def create_brand_model(max_sequence_length, embedding_dim):
    brand_input = Input(shape=(max_sequence_length, embedding_dim), name="brand_input")
    brand_features = LSTM(64, return_sequences=True)(brand_input)
    brand_features = LSTM(64)(brand_features)
    return Model(inputs=brand_input, outputs=brand_features, name="BrandModel")

# Tagline Model
def create_tagline_model(max_sequence_length, embedding_dim):
    tagline_input = Input(shape=(max_sequence_length, embedding_dim), name="tagline_input")
    tagline_features = LSTM(64, return_sequences=True)(tagline_input)
    tagline_features = LSTM(64)(tagline_features)
    return Model(inputs=tagline_input, outputs=tagline_features, name="TaglineModel")

# Combined Model
def create_combined_model(input_shape, max_sequence_length, embedding_dim):
    image_model = create_image_model(input_shape)
    brand_model = create_brand_model(max_sequence_length, embedding_dim)
    tagline_model = create_tagline_model(max_sequence_length, embedding_dim)

    # Merge the outputs of the three models
    combined_features = concatenate([image_model.output, brand_model.output, tagline_model.output])

    # Add Dense layers after concatenation
    x = Dense(128, activation='relu')(combined_features)
    x = Dropout(0.5)(x)
    x = BatchNormalization()(x)
    output = Dense(1, activation='sigmoid')(x)

    # Final model
    model = Model(inputs=[image_model.input, brand_model.input, tagline_model.input], outputs=output, name="CombinedModel")

    # Compile the model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    return model

# Prepare the input data
input_shape = (224, 224, 3)  # Updated input shape to (224, 224, 3)
max_sequence_length = 10  # Adjust according to your data
embedding_dim = 100

# Load the combined model
model = create_combined_model(input_shape, max_sequence_length, embedding_dim)

@app.route('/test', methods=['POST'])
def test_logo_detection():
    logging.info("Received request for logo detection.")
    
    if 'image' not in request.files:
        logging.error("No image file provided.")
        return jsonify({"error": "No image file provided."}), 400

    file = request.files['image']

    if file.filename == '':
        logging.error("No selected file.")
        return jsonify({"error": "No selected file."}), 400

    # Read the image using OpenCV
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    if img is None:
        logging.error("Could not read the image.")
        return jsonify({"error": "Could not read the image."}), 400

    # Resize and normalize the image for prediction
    img_preprocessed = preprocess_image(img, (224, 224))
    logging.info("Image resized and normalized for prediction.")

    # Prepare dummy brand and tagline data
    dummy_brand = np.zeros((1, max_sequence_length, embedding_dim))
    dummy_tagline = np.zeros((1, max_sequence_length, embedding_dim))

    # Make prediction
    y_pred = model.predict([img_preprocessed[np.newaxis, ...], dummy_brand, dummy_tagline])
    
    # Apply threshold to classify as Genuine or Fake
    threshold = 0.5  # Adjustable threshold
    probability_fake = float(y_pred[0][0])  # Probability of being "Fake"
    probability_genuine = 1 - probability_fake  # Probability of being "Genuine"
    predicted_class = "Genuine" if probability_genuine >= threshold else "Fake"
    
    logging.info(f"Predicted class: {predicted_class} with probabilities - Fake: {probability_fake:.2f}, Genuine: {probability_genuine:.2f}")

    return jsonify({
        'predicted_class': predicted_class,
        'probabilities': {
            'Fake': probability_fake,
            'Genuine': probability_genuine
        }
    })

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)

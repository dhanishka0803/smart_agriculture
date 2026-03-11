"""
AgriSense AI - Plant Disease Detection Model Training
Dataset: PlantVillage (38 classes)
Model: MobileNetV2 (Transfer Learning)
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os
import json

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20
NUM_CLASSES = 38

# Disease classes from PlantVillage dataset
DISEASE_CLASSES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

def download_dataset():
    """
    Download PlantVillage dataset from Kaggle
    Dataset: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
    
    Manual steps:
    1. Download from Kaggle
    2. Extract to: backend/ml_model/dataset/PlantVillage/
    3. Structure should be: dataset/PlantVillage/train/ and dataset/PlantVillage/val/
    """
    print("=" * 60)
    print("DATASET DOWNLOAD INSTRUCTIONS")
    print("=" * 60)
    print("\n1. Go to: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset")
    print("2. Download the dataset (requires Kaggle account)")
    print("3. Extract to: backend/ml_model/dataset/PlantVillage/")
    print("4. Ensure structure:")
    print("   - dataset/PlantVillage/train/")
    print("   - dataset/PlantVillage/val/")
    print("\nDataset contains 54,305 images across 38 disease classes")
    print("=" * 60)

def create_data_generators(data_dir):
    """Create data generators with augmentation"""
    
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    train_generator = train_datagen.flow_from_directory(
        os.path.join(data_dir, 'train'),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    val_generator = val_datagen.flow_from_directory(
        os.path.join(data_dir, 'val'),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    return train_generator, val_generator

def build_model():
    """Build MobileNetV2-based model"""
    
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Build model
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    return model

def train_model(model, train_gen, val_gen):
    """Train the model"""
    
    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7
        ),
        keras.callbacks.ModelCheckpoint(
            'plant_disease_model_best.h5',
            monitor='val_accuracy',
            save_best_only=True
        )
    ]
    
    # Train
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    return history

def save_model_and_metadata(model, class_indices):
    """Save model and class information"""
    
    # Save model in TensorFlow SavedModel format
    model.save('plant_disease_model')
    
    # Save as H5 (backup)
    model.save('plant_disease_model.h5')
    
    # Save class indices
    class_names = {v: k for k, v in class_indices.items()}
    with open('class_indices.json', 'w') as f:
        json.dump(class_names, f, indent=2)
    
    print("\n✅ Model saved successfully!")
    print("   - plant_disease_model/ (TensorFlow format)")
    print("   - plant_disease_model.h5 (H5 format)")
    print("   - class_indices.json (Class names)")

def main():
    """Main training pipeline"""
    
    print("=" * 60)
    print("AgriSense AI - Disease Detection Model Training")
    print("=" * 60)
    
    # Check if dataset exists
    data_dir = 'dataset/PlantVillage'
    if not os.path.exists(data_dir):
        print("\n❌ Dataset not found!")
        download_dataset()
        return
    
    print("\n📊 Loading dataset...")
    train_gen, val_gen = create_data_generators(data_dir)
    
    print(f"\n✅ Dataset loaded:")
    print(f"   Training samples: {train_gen.samples}")
    print(f"   Validation samples: {val_gen.samples}")
    print(f"   Number of classes: {len(train_gen.class_indices)}")
    
    print("\n🏗️ Building model...")
    model = build_model()
    model.summary()
    
    print("\n🚀 Starting training...")
    history = train_model(model, train_gen, val_gen)
    
    print("\n💾 Saving model...")
    save_model_and_metadata(model, train_gen.class_indices)
    
    # Print final metrics
    final_train_acc = history.history['accuracy'][-1]
    final_val_acc = history.history['val_accuracy'][-1]
    
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print("=" * 60)
    print(f"Final Training Accuracy: {final_train_acc*100:.2f}%")
    print(f"Final Validation Accuracy: {final_val_acc*100:.2f}%")
    print("=" * 60)

if __name__ == "__main__":
    main()

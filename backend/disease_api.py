"""
AgriSense AI - Disease Detection API
FastAPI backend with TensorFlow model
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import numpy as np
import io
import json
import os
from typing import Dict, Any

app = FastAPI(title="AgriSense AI - Disease Detection API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://smartagriculture-frontend-jwzd.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
model = None
class_names = None
disease_info = None

# Configuration
IMG_SIZE = 224
CONFIDENCE_THRESHOLD = 0.5
PLANT_CONFIDENCE_THRESHOLD = 0.3

def load_model():
    """Load the trained model"""
    global model, class_names, disease_info
    
    try:
        # Try loading SavedModel format
        model_path = 'ml_model/plant_disease_model'
        if os.path.exists(model_path):
            model = keras.models.load_model(model_path)
            print("✅ Model loaded from SavedModel format")
        else:
            # Try H5 format
            h5_path = 'ml_model/plant_disease_model.h5'
            if os.path.exists(h5_path):
                model = keras.models.load_model(h5_path)
                print("✅ Model loaded from H5 format")
            else:
                print("⚠️ No trained model found. Using mock predictions.")
                model = None
        
        # Load class names
        class_indices_path = 'ml_model/class_indices.json'
        if os.path.exists(class_indices_path):
            with open(class_indices_path, 'r') as f:
                class_names = json.load(f)
            print(f"✅ Loaded {len(class_names)} disease classes")
        else:
            print("⚠️ Class indices not found")
            class_names = None
        
        # Load disease information
        disease_info_path = 'ml_model/disease_info.json'
        if os.path.exists(disease_info_path):
            with open(disease_info_path, 'r') as f:
                disease_info = json.load(f)
            print(f"✅ Loaded disease information for {len(disease_info)} diseases")
        else:
            print("⚠️ Disease info not found")
            disease_info = {}
            
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        model = None

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model prediction"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize
    image = image.resize((IMG_SIZE, IMG_SIZE))
    
    # Convert to array and normalize
    img_array = np.array(image) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def is_plant_image(image: Image.Image) -> tuple[bool, float]:
    """
    Check if image contains a plant/leaf
    Uses simple heuristics: green color dominance and texture
    """
    try:
        # Resize for faster processing
        img = image.resize((100, 100))
        img_array = np.array(img)
        
        # Convert to HSV for better color detection
        if len(img_array.shape) == 3:
            # Calculate green dominance
            r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
            
            # Green should be dominant in plant images
            green_dominance = np.mean(g) / (np.mean(r) + np.mean(g) + np.mean(b) + 1e-6)
            
            # Check for green-ish colors (HSV hue between 60-180)
            # Simple approximation
            green_pixels = np.sum((g > r) & (g > b))
            total_pixels = img_array.shape[0] * img_array.shape[1]
            green_ratio = green_pixels / total_pixels
            
            # Calculate texture variance (plants have texture)
            gray = np.mean(img_array, axis=2)
            texture_variance = np.var(gray)
            
            # Scoring
            plant_score = 0.0
            
            # Green dominance score (0-0.4)
            if green_dominance > 0.35:
                plant_score += 0.4
            elif green_dominance > 0.30:
                plant_score += 0.3
            elif green_dominance > 0.25:
                plant_score += 0.2
            
            # Green ratio score (0-0.4)
            if green_ratio > 0.3:
                plant_score += 0.4
            elif green_ratio > 0.2:
                plant_score += 0.3
            elif green_ratio > 0.1:
                plant_score += 0.2
            
            # Texture score (0-0.2)
            if texture_variance > 500:
                plant_score += 0.2
            elif texture_variance > 300:
                plant_score += 0.1
            
            is_plant = plant_score >= PLANT_CONFIDENCE_THRESHOLD
            
            return is_plant, plant_score
        
        return False, 0.0
        
    except Exception as e:
        print(f"Error in plant detection: {e}")
        return True, 0.5  # Default to True to avoid false negatives

def get_severity_level(disease_class: str, confidence: float) -> str:
    """Determine severity level based on disease and confidence"""
    
    if disease_class not in disease_info:
        return "Unknown"
    
    thresholds = disease_info[disease_class].get('severity_threshold', {})
    
    if confidence >= thresholds.get('high', 0.8):
        return "High"
    elif confidence >= thresholds.get('medium', 0.5):
        return "Medium"
    else:
        return "Low"

def get_disease_details(disease_class: str) -> Dict[str, Any]:
    """Get detailed information about the disease"""
    
    if disease_class in disease_info:
        return disease_info[disease_class]
    
    # Default response for unknown diseases
    return {
        "disease_name": disease_class.replace('___', ' - ').replace('_', ' '),
        "crop": "Unknown",
        "symptoms": ["Disease detected but detailed information not available"],
        "treatment": ["Consult with local agricultural extension officer"],
        "prevention": ["Regular monitoring and good agricultural practices"]
    }

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AgriSense AI - Disease Detection API",
        "model_loaded": model is not None,
        "version": "2.0"
    }

@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    """
    Predict plant disease from uploaded image
    
    Returns:
        - disease: Disease name
        - confidence: Prediction confidence (0-1)
        - severity: Risk level (High/Medium/Low)
        - symptoms: List of symptoms
        - treatment: List of treatment steps
        - prevention: List of prevention tips
    """
    
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload an image file."
            )
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Check if image contains a plant
        is_plant, plant_confidence = is_plant_image(image)
        
        if not is_plant:
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "error": "not_a_plant",
                    "message": "This image does not appear to be a crop or plant leaf. Please upload a clear image of a plant leaf.",
                    "plant_confidence": float(plant_confidence)
                }
            )
        
        # If model is not loaded, return mock prediction
        if model is None:
            return get_mock_prediction()
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        # Check confidence threshold
        if confidence < CONFIDENCE_THRESHOLD:
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "error": "low_confidence",
                    "message": "Unable to identify disease with high confidence. Please upload a clearer crop image with better lighting.",
                    "confidence": confidence
                }
            )
        
        # Get disease class name
        disease_class = class_names.get(str(predicted_class_idx), "Unknown")
        
        # Get disease details
        details = get_disease_details(disease_class)
        
        # Determine severity
        severity = get_severity_level(disease_class, confidence)
        
        # Prepare response
        response = {
            "success": True,
            "disease": details["disease_name"],
            "disease_class": disease_class,
            "crop": details["crop"],
            "confidence": round(confidence, 3),
            "severity": severity,
            "symptoms": details["symptoms"],
            "treatment": details["treatment"],
            "prevention": details["prevention"],
            "plant_confidence": float(plant_confidence)
        }
        
        return JSONResponse(content=response)
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )

def get_mock_prediction():
    """Return mock prediction when model is not available"""
    return JSONResponse(
        content={
            "success": True,
            "disease": "Potato Early Blight",
            "disease_class": "Potato___Early_blight",
            "crop": "Potato",
            "confidence": 0.87,
            "severity": "Medium",
            "symptoms": [
                "Dark brown spots with concentric rings on older leaves",
                "Yellowing of leaves around the spots",
                "Premature leaf drop"
            ],
            "treatment": [
                "Apply fungicides containing chlorothalonil or mancozeb",
                "Remove and destroy infected plant parts immediately",
                "Improve air circulation by proper spacing"
            ],
            "prevention": [
                "Use certified disease-free seed potatoes",
                "Practice crop rotation (3-4 year cycle)",
                "Maintain proper plant spacing"
            ],
            "note": "Using mock prediction - model not loaded"
        }
    )

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes_loaded": class_names is not None,
        "disease_info_loaded": disease_info is not None,
        "num_classes": len(class_names) if class_names else 0,
        "num_diseases_info": len(disease_info) if disease_info else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

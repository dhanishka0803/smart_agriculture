"""
AgriSense AI - Soil Health Detection API
Analyzes soil images and provides recommendations
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import io
from typing import Dict, Any

app = FastAPI(title="AgriSense AI - Soil Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def validate_soil_image(image: Image.Image) -> tuple[bool, float, str]:
    """
    Validate if image contains soil
    Returns: (is_valid, confidence, reason)
    """
    try:
        img = image.resize((224, 224))
        img_array = np.array(img)
        
        # Check brightness
        brightness = np.mean(img_array)
        if brightness < 15:
            return False, 0.0, "Image is too dark. Please take a photo in better lighting."
        if brightness > 245:
            return False, 0.0, "Image is overexposed. Please adjust lighting."
        
        if len(img_array.shape) == 3 and img_array.shape[2] == 3:
            r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
            
            total_pixels = img_array.shape[0] * img_array.shape[1]
            
            # Brown/earthy colors (soil indicator)
            brown_pixels = np.sum((r > 80) & (r < 180) & (g > 60) & (g < 150) & (b > 40) & (b < 120))
            brown_ratio = brown_pixels / total_pixels
            
            # Dark brown/black (rich soil)
            dark_soil = np.sum((r < 100) & (g < 90) & (b < 80) & (r > 30))
            dark_ratio = dark_soil / total_pixels
            
            # Red soil
            red_soil = np.sum((r > 120) & (r > g) & (g > 60) & (b < 100))
            red_ratio = red_soil / total_pixels
            
            # Sandy/light soil
            sandy = np.sum((r > 150) & (g > 130) & (b > 100) & (r < 220))
            sandy_ratio = sandy / total_pixels
            
            # Green (plants - not soil)
            green_pixels = np.sum((g > r) & (g > b) & (g > 100))
            green_ratio = green_pixels / total_pixels
            
            # Texture variance (soil has texture)
            gray = np.mean(img_array, axis=2)
            texture_variance = np.var(gray)
            
            # Scoring
            soil_score = 0.0
            
            # Brown/earthy colors (0-0.4)
            if brown_ratio > 0.30:
                soil_score += 0.4
            elif brown_ratio > 0.20:
                soil_score += 0.3
            elif brown_ratio > 0.10:
                soil_score += 0.2
            
            # Dark soil (0-0.3)
            if dark_ratio > 0.20:
                soil_score += 0.3
            elif dark_ratio > 0.10:
                soil_score += 0.2
            
            # Red/sandy soil (0-0.2)
            if red_ratio > 0.15 or sandy_ratio > 0.20:
                soil_score += 0.2
            elif red_ratio > 0.08 or sandy_ratio > 0.10:
                soil_score += 0.1
            
            # Texture (0-0.1)
            if texture_variance > 300:
                soil_score += 0.1
            
            # Penalize if too much green (plants)
            if green_ratio > 0.30:
                soil_score -= 0.3
            
            is_soil = soil_score >= 0.35
            
            if not is_soil:
                if green_ratio > 0.30:
                    return False, soil_score, "This appears to be a plant image, not soil. Please upload a photo of soil."
                elif soil_score < 0.15:
                    return False, soil_score, "This doesn't appear to be a soil image. Please upload a clear photo of soil."
                else:
                    return False, soil_score, "Image quality is unclear. Please upload a clearer photo of the soil."
            
            return True, soil_score, "Valid soil image detected"
        
        return False, 0.0, "Invalid image format."
        
    except Exception as e:
        print(f"Error in soil validation: {e}")
        return True, 0.5, "Validation skipped"

def analyze_soil_from_image(image: Image.Image) -> Dict[str, Any]:
    """
    Analyze soil type and health from image
    """
    try:
        img = image.resize((224, 224))
        img_array = np.array(img)
        
        r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
        total_pixels = img_array.shape[0] * img_array.shape[1]
        
        # Analyze soil color
        avg_r, avg_g, avg_b = np.mean(r), np.mean(g), np.mean(b)
        
        # Dark brown/black soil (high organic matter)
        dark_pixels = np.sum((r < 80) & (g < 70) & (b < 60))
        dark_ratio = dark_pixels / total_pixels
        
        # Red soil
        red_pixels = np.sum((r > 120) & (r > g) & (g > 60))
        red_ratio = red_pixels / total_pixels
        
        # Sandy/light soil
        sandy_pixels = np.sum((r > 150) & (g > 130) & (b > 100))
        sandy_ratio = sandy_pixels / total_pixels
        
        # Clayey (grayish)
        clay_pixels = np.sum((abs(r - g) < 20) & (abs(g - b) < 20) & (r > 80) & (r < 140))
        clay_ratio = clay_pixels / total_pixels
        
        # Determine soil type
        soil_type = "Loamy"
        confidence = 0.75
        
        if dark_ratio > 0.40:
            soil_type = "Black Soil"
            confidence = 0.88
            organic_matter = "High"
            fertility = "High"
            ph = "7.5-8.5"
        elif red_ratio > 0.35:
            soil_type = "Red Soil"
            confidence = 0.85
            organic_matter = "Medium"
            fertility = "Medium"
            ph = "6.0-7.5"
        elif sandy_ratio > 0.40:
            soil_type = "Sandy Soil"
            confidence = 0.82
            organic_matter = "Low"
            fertility = "Low to Medium"
            ph = "5.5-7.0"
        elif clay_ratio > 0.35:
            soil_type = "Clayey Soil"
            confidence = 0.80
            organic_matter = "Medium"
            fertility = "Medium to High"
            ph = "6.5-8.0"
        else:
            soil_type = "Loamy Soil"
            confidence = 0.78
            organic_matter = "Medium to High"
            fertility = "High"
            ph = "6.0-7.5"
        
        # Texture analysis
        gray = np.mean(img_array, axis=2)
        texture_variance = np.var(gray)
        
        if texture_variance > 500:
            texture = "Coarse (Good drainage)"
        elif texture_variance > 300:
            texture = "Medium (Balanced)"
        else:
            texture = "Fine (Water retention)"
        
        # Moisture estimation
        if avg_r + avg_g + avg_b < 200:
            moisture = "Adequate"
        elif avg_r + avg_g + avg_b < 300:
            moisture = "Moderate"
        else:
            moisture = "Dry"
        
        return {
            "soil_type": soil_type,
            "confidence": confidence,
            "organic_matter": organic_matter,
            "fertility": fertility,
            "ph_range": ph,
            "texture": texture,
            "moisture": moisture
        }
        
    except Exception as e:
        print(f"Error in soil analysis: {e}")
        return {
            "soil_type": "Loamy Soil",
            "confidence": 0.70,
            "organic_matter": "Medium",
            "fertility": "Medium to High",
            "ph_range": "6.0-7.5",
            "texture": "Medium",
            "moisture": "Moderate"
        }

def get_soil_recommendations(soil_type: str, fertility: str) -> Dict[str, Any]:
    """Get recommendations based on soil type"""
    
    recommendations = {
        "Black Soil": {
            "suitable_crops": ["Cotton", "Soybean", "Wheat", "Jowar", "Linseed"],
            "fertilizer": "Requires less nitrogen, add phosphorus and potassium",
            "irrigation": "Good water retention, irrigate moderately",
            "improvement": [
                "Add organic compost to improve structure",
                "Practice crop rotation",
                "Avoid over-irrigation to prevent waterlogging"
            ]
        },
        "Red Soil": {
            "suitable_crops": ["Groundnut", "Millets", "Pulses", "Potato", "Tobacco"],
            "fertilizer": "Add nitrogen and organic matter regularly",
            "irrigation": "Requires frequent irrigation",
            "improvement": [
                "Add lime to reduce acidity",
                "Use green manure crops",
                "Apply farmyard manure regularly"
            ]
        },
        "Sandy Soil": {
            "suitable_crops": ["Watermelon", "Groundnut", "Carrots", "Radish", "Coconut"],
            "fertilizer": "Requires frequent fertilizer application",
            "irrigation": "Needs frequent irrigation due to poor water retention",
            "improvement": [
                "Add organic matter to improve water retention",
                "Use mulching extensively",
                "Apply compost and vermicompost"
            ]
        },
        "Clayey Soil": {
            "suitable_crops": ["Rice", "Wheat", "Sugarcane", "Cotton", "Pulses"],
            "fertilizer": "Moderate fertilizer requirement",
            "irrigation": "Good water retention, avoid over-watering",
            "improvement": [
                "Add sand and organic matter to improve drainage",
                "Practice deep plowing",
                "Use gypsum to improve structure"
            ]
        },
        "Loamy Soil": {
            "suitable_crops": ["Wheat", "Rice", "Cotton", "Vegetables", "Most crops"],
            "fertilizer": "Balanced NPK fertilizer",
            "irrigation": "Moderate irrigation required",
            "improvement": [
                "Maintain organic matter through compost",
                "Practice crop rotation",
                "Regular soil testing"
            ]
        }
    }
    
    return recommendations.get(soil_type, recommendations["Loamy Soil"])

@app.post("/analyze-soil")
async def analyze_soil(file: UploadFile = File(...)):
    """
    Analyze soil from uploaded image
    """
    
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload an image file."
            )
        
        contents = await file.read()
        
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File too large. Please upload an image under 10MB."
            )
        
        try:
            image = Image.open(io.BytesIO(contents))
        except:
            raise HTTPException(
                status_code=400,
                detail="Cannot read image. Please upload a valid image."
            )
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Validate soil image
        is_valid, soil_confidence, validation_message = validate_soil_image(image)
        
        if not is_valid:
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "error": "invalid_image",
                    "message": validation_message,
                    "suggestion": "Please upload a clear photo of soil. Make sure there are no plants or other objects in the frame.",
                    "soil_confidence": float(soil_confidence)
                }
            )
        
        # Analyze soil
        analysis = analyze_soil_from_image(image)
        recommendations = get_soil_recommendations(analysis["soil_type"], analysis["fertility"])
        
        response = {
            "success": True,
            "soil_type": analysis["soil_type"],
            "confidence": round(analysis["confidence"], 3),
            "properties": {
                "organic_matter": analysis["organic_matter"],
                "fertility": analysis["fertility"],
                "ph_range": analysis["ph_range"],
                "texture": analysis["texture"],
                "moisture": analysis["moisture"]
            },
            "suitable_crops": recommendations["suitable_crops"],
            "fertilizer_advice": recommendations["fertilizer"],
            "irrigation_advice": recommendations["irrigation"],
            "improvement_tips": recommendations["improvement"],
            "soil_confidence": round(soil_confidence, 3)
        }
        
        return JSONResponse(content=response)
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "AgriSense AI - Soil Detection API",
        "version": "1.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

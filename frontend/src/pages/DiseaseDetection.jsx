import { useState } from 'react';
import { Upload, Camera, AlertTriangle, CheckCircle, Leaf, Shield, Loader, X } from 'lucide-react';

function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large. Please upload an image under 10MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image file.');
        return;
      }

      setSelectedImage(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      // Use deployed backend API
      const apiUrl = 'https://smart-agriculture-4pz4.onrender.com';
      const response = await fetch(`${apiUrl}/predict-disease`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        // Handle specific error types
        if (data.error === 'not_a_plant') {
          setError(data.message);
        } else if (data.error === 'low_confidence') {
          setError(data.message);
        } else {
          setError('Failed to analyze image. Please try again.');
        }
        setResult(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Unable to connect to disease detection service. Please ensure the ML API is running.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <div className="gradient-bg text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">AI Disease Detection</h2>
        <p className="text-green-100">Upload crop images for instant disease identification and treatment recommendations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Camera className="w-6 h-6 mr-2 text-primary" />
            Upload Crop Image
          </h3>

          <div className="space-y-4">
            <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleReset();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                  Analyzing crop disease...
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5 inline mr-2" />
                  Analyze Disease
                </>
              )}
            </button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Tips for Best Results:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Take clear, well-lit photos</li>
                <li>• Focus on affected leaves or parts</li>
                <li>• Avoid blurry or dark images</li>
                <li>• Ensure the leaf fills most of the frame</li>
                <li>• Upload only plant/crop images</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-primary" />
            Analysis Results
          </h3>

          {!result ? (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Upload an image to see disease analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Disease Name and Confidence */}
              <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-2xl font-bold">{result.disease}</h4>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getSeverityColor(result.severity)}`}>
                    {getSeverityIcon(result.severity)} {result.severity} Risk
                  </span>
                </div>
                
                {result.crop && (
                  <p className="text-green-100 mb-3">Crop: {result.crop}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence Level</span>
                    <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h5 className="font-bold text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Symptoms
                </h5>
                <ul className="text-sm text-red-700 space-y-2">
                  {result.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h5 className="font-bold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Treatment
                </h5>
                <ul className="text-sm text-green-700 space-y-2">
                  {result.treatment.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Prevention
                </h5>
                <ul className="text-sm text-blue-700 space-y-2">
                  {result.prevention.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button onClick={handleReset} className="btn-secondary flex-1">
                  Analyze Another Image
                </button>
                <button className="btn-primary flex-1">
                  Save Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sample Images */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Sample Disease Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" alt="Plant Disease 1" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80" alt="Plant Disease 2" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80" alt="Plant Disease 3" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" alt="Plant Disease 4" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;

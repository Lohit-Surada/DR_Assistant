# AI-Based Diabetic Retinopathy Lesion Detection

A Flask web application for detecting retinal lesions with the trained Ultralytics YOLO model in `best.pt`.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 and upload a JPG, JPEG, or PNG retinal fundus image. The app stores uploads under `uploads/` and annotated results under `static/results/`.

The model uses `imgsz=1024`, a 0.25 confidence threshold, automatic CUDA/CPU selection, and custom colored lesion boxes. It is a research prototype and does not provide a medical diagnosis.
